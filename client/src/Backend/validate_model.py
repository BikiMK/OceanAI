# validate_model.py
"""
Model loader/validator for OceanAI.

- Tries joblib.load (recommended for sklearn pipelines).
- Falls back to a compatibility pickle unpickler for some cross-version issues.
- If the artifact is a dict with a "pipeline" key, it unwraps the pipeline.
- Exposes ModelValidator with attributes:
    - model: loaded pipeline/model object
    - feature_names: detected feature order (list) or None
    - loaded_path: Path of loaded file
"""

from pathlib import Path
import joblib
import pickle
import logging
import io
from typing import Optional, Any, Tuple

# try to import sklearn Pipeline to help compat mapping
try:
    from sklearn.pipeline import Pipeline as SKPipeline  # type: ignore
except Exception:
    SKPipeline = None

logger = logging.getLogger("validate_model")
logger.setLevel(logging.INFO)


class CompatUnpickler(pickle.Unpickler):
    """
    Custom Unpickler to remap loose 'Pipeline' references to sklearn.pipeline.Pipeline when possible.
    Improves compatibility for pickles created in different environments.
    """

    def find_class(self, module: str, name: str):
        # if pickle references 'Pipeline' without full module, map to sklearn Pipeline if available
        try:
            if name == "Pipeline" and SKPipeline is not None:
                return SKPipeline
            if module in ("Pipeline", "") and name == "Pipeline" and SKPipeline is not None:
                return SKPipeline
            if module == "sklearn.pipeline" and name == "Pipeline" and SKPipeline is not None:
                return SKPipeline
        except Exception:
            pass
        return super().find_class(module, name)


def _pickle_load_compat(path: Path) -> Any:
    """Try to load pickle using CompatUnpickler if normal pickle.loads fails."""
    logger.info("Attempting compatibility pickle load for: %s", path)
    data = path.read_bytes()
    try:
        return pickle.loads(data)
    except Exception as e_pick:
        logger.info("Standard pickle.loads failed: %s. Trying CompatUnpickler...", e_pick)
        try:
            bio = io.BytesIO(data)
            unpickler = CompatUnpickler(bio)
            return unpickler.load()
        except Exception as e_compat:
            logger.error("CompatUnpickler also failed: %s", e_compat)
            raise


class ModelValidator:
    """
    Loads and validates a model artifact.

    Usage:
        mv = ModelValidator("models/ocean_pipeline.pkl")
        model = mv.model
        features = mv.feature_names
    """

    def __init__(self, path: str):
        self.path = Path(path)
        self.model: Optional[Any] = None
        self.feature_names: Optional[list] = None
        self.loaded_path: Optional[Path] = None

        logger.info("Initializing with model path: %s", self.path)
        if not self.path.exists():
            msg = f"Model file not found at {self.path}: [Errno 2] No such file or directory"
            logger.error(msg)
            raise FileNotFoundError(msg)

        self._load()

    def _load(self):
        # Try joblib.load first
        try:
            logger.info("Attempting to load model using joblib from: %s", self.path)
            m = joblib.load(self.path)
            self.model = m
            self.loaded_path = self.path
            logger.info("Loaded via joblib: %s", type(m))
        except Exception as e_joblib:
            logger.warning("joblib.load failed: %s", e_joblib)
            # Try pickle compatibility loading
            try:
                m = _pickle_load_compat(self.path)
                self.model = m
                self.loaded_path = self.path
                logger.info("Loaded via compatibility pickle from: %s", self.path)
            except Exception as e_pickle:
                logger.error("Unexpected error loading model from %s: %s", self.path, e_pickle)
                raise

        # Validate & unwrap artifacts
        if self.model is None:
            raise RuntimeError("Model loaded but is None")

        # If artifact is a dict with 'pipeline' key, unwrap it
        if isinstance(self.model, dict) and "pipeline" in self.model:
            logger.info("Artifact is a dict with 'pipeline' key — unwrapping.")
            pipeline_candidate = self.model.get("pipeline")
            if pipeline_candidate is None:
                raise RuntimeError("Artifact 'pipeline' key is None")
            if not hasattr(pipeline_candidate, "predict"):
                raise RuntimeError("Artifact 'pipeline' found but does not implement predict.")
            self.model = pipeline_candidate
            # try to get features from artifact as well
            for candidate in ("features", "feature_order", "feature_names"):
                if candidate in self.model and isinstance(self.model[candidate], (list, tuple)):
                    # note: if we just replaced self.model with pipeline, skip this;
                    # we check the original dict above instead
                    pass
            # If the original dict also contained 'features', extract it:
            try:
                original = joblib.load(self.loaded_path)
                if isinstance(original, dict):
                    for candidate in ("features", "feature_order", "feature_names"):
                        if candidate in original and isinstance(original[candidate], (list, tuple)):
                            self.feature_names = list(original[candidate])
                            logger.info("Extracted feature names from artifact key '%s'", candidate)
                            break
            except Exception:
                # not critical
                pass

        # If loaded object itself implements predict, great. Otherwise fail
        if not hasattr(self.model, "predict"):
            raise RuntimeError("Loaded object does not implement 'predict' – not a valid model/pipeline.")

        # Try to extract feature names from model/preprocessor
        try:
            # sklearn attribute
            if hasattr(self.model, "feature_names_in_"):
                try:
                    self.feature_names = list(getattr(self.model, "feature_names_in_"))
                    logger.info("Detected model.feature_names_in_ (len=%d).", len(self.feature_names))
                except Exception:
                    self.feature_names = None

            # If sklearn Pipeline, check named_steps -> preprocessor
            if self.feature_names is None and hasattr(self.model, "named_steps"):
                try:
                    pre = getattr(self.model, "named_steps", {}).get("preprocessor")
                    if pre is not None:
                        if hasattr(pre, "get_feature_names_out"):
                            try:
                                self.feature_names = list(pre.get_feature_names_out())
                                logger.info("Extracted feature names from preprocessor.get_feature_names_out()")
                            except Exception:
                                self.feature_names = None
                        elif hasattr(pre, "transformers_"):
                            cols = []
                            for name, trans, col_idx in getattr(pre, "transformers_"):
                                if isinstance(col_idx, (list, tuple)):
                                    cols.extend(list(col_idx))
                            if cols:
                                # unique preserve order
                                seen = set()
                                ordered = []
                                for c in cols:
                                    if c not in seen:
                                        seen.add(c)
                                        ordered.append(c)
                                self.feature_names = ordered
                                logger.info("Inferred feature names from preprocessor.transformers_")
                except Exception:
                    self.feature_names = self.feature_names or None

            # If model was originally an artifact dict(joblib.load returned dict), try keys
            # We attempted earlier, but do one more safe check
            if self.feature_names is None and isinstance(self.model, dict):
                for candidate in ("features", "feature_order", "feature_names"):
                    if candidate in self.model and isinstance(self.model[candidate], (list, tuple)):
                        try:
                            self.feature_names = list(self.model[candidate])
                            logger.info("Extracted feature names from artifact key '%s'", candidate)
                            break
                        except Exception:
                            continue
        except Exception as e_feat:
            logger.warning("Failed to extract feature names: %s", e_feat)
            self.feature_names = None

        logger.info("Model load complete. type=%s, feature_names=%s", type(self.model), bool(self.feature_names))


# convenience loader
def load_model(path: str) -> Tuple[Any, Optional[list]]:
    v = ModelValidator(path)
    return v.model, v.feature_names


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python validate_model.py path/to/model.pkl")
        sys.exit(1)
    p = sys.argv[1]
    try:
        mv = ModelValidator(p)
        print("Loaded model:", type(mv.model))
        print("Feature names available:", bool(mv.feature_names))
        if mv.feature_names:
            print("Feature names (sample):", mv.feature_names[:10])
    except Exception as exc:
        print("Failed to load model:", exc)
        raise
