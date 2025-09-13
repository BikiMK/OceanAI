import pickle
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelValidator:
    def __init__(self, model_path: str):
        self.model_path = Path(model_path).resolve()  # Resolve to absolute path
        self.model = None
        logger.info(f"Initializing with model path: {self.model_path}")
        self.load_model()
    
    def load_model(self):
        """Load the pickled model with detailed logging and version compatibility handling"""
        logger.info(f"Attempting to load model from: {self.model_path}")
        try:
            # Try loading with warnings suppressed first
            import warnings
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
            logger.info(f"Model loaded successfully from {self.model_path}")
            logger.info(f"Model type: {type(self.model)}")
        except FileNotFoundError as e:
            logger.error(f"Model file not found at {self.model_path}: {e}")
            raise
        except (pickle.UnpicklingError, AttributeError, TypeError) as e:
            logger.warning(f"Standard pickle loading failed: {e}")
            # Try alternative loading methods for version compatibility
            try:
                logger.info("Attempting compatibility mode loading...")
                import joblib
                self.model = joblib.load(self.model_path)
                logger.info(f"Model loaded successfully using joblib from {self.model_path}")
                logger.info(f"Model type: {type(self.model)}")
            except Exception as joblib_error:
                logger.error(f"Joblib loading also failed: {joblib_error}")
                logger.error(f"All loading methods failed for {self.model_path}")
                raise
        except Exception as e:
            logger.error(f"Unexpected error loading model from {self.model_path}: {e}")
            raise
    
    def inspect_model(self):
        """Inspect model properties"""
        if self.model is None:
            logger.error("Model not loaded")
            return
        
        logger.info("=== Model Inspection ===")
        logger.info(f"Model type: {type(self.model)}")
        
        if hasattr(self.model, 'get_params'):
            logger.info(f"Model parameters: {self.model.get_params()}")
        
        if hasattr(self.model, 'feature_names_in_'):
            logger.info(f"Expected features: {self.model.feature_names_in_}")
        
        if hasattr(self.model, 'n_features_in_'):
            logger.info(f"Number of features: {self.model.n_features_in_}")
        
        if hasattr(self.model, 'classes_'):
            logger.info(f"Classes: {self.model.classes_}")
    
    def validate_input(self):
        """Validate if sample input matches model expectations"""
        if self.model is None:
            logger.error("Model not loaded, cannot validate input")
            return False
        
        sample_data = np.array([[25.0, 7.5, 0.15, 0.8]])  # Default sample
        is_valid = True
        
        if hasattr(self.model, 'feature_names_in_'):
            expected_features = self.model.feature_names_in_
            if len(sample_data[0]) != len(expected_features):
                logger.error(f"Sample data length ({len(sample_data[0])}) does not match expected features count ({len(expected_features)}): {expected_features}")
                is_valid = False
            else:
                logger.info(f"Sample data matches expected features: {expected_features}")
        elif hasattr(self.model, 'n_features_in_'):
            if len(sample_data[0]) != self.model.n_features_in_:
                logger.error(f"Sample data length ({len(sample_data[0])}) does not match n_features_in_ ({self.model.n_features_in_})")
                is_valid = False
            else:
                logger.info(f"Sample data length matches n_features_in_: {self.model.n_features_in_}")
        
        return is_valid
    
    def test_prediction(self):
        """Test model prediction with sample data"""
        if self.model is None:
            logger.error("Model not loaded")
            return
        
        sample_data = np.array([[25.0, 7.5, 0.15, 0.8]])  # Adjust to match feature_names_in_
        
        if not self.validate_input():
            logger.error("Input validation failed, skipping prediction test")
            return
        
        try:
            if hasattr(self.model, 'feature_names_in_'):
                sample_df = pd.DataFrame(sample_data, columns=self.model.feature_names_in_)
                prediction = self.model.predict(sample_df)
            else:
                prediction = self.model.predict(sample_data)
            
            logger.info(f"Sample prediction: {prediction}")
            
            if hasattr(self.model, 'classes_'):
                true_label = [0]  # Replace with actual label
                logger.info(f"Accuracy: {accuracy_score(true_label, prediction)}")
                logger.info(f"Classification Report:\n{classification_report(true_label, prediction)}")
                logger.info(f"Confusion Matrix:\n{confusion_matrix(true_label, prediction)}")
                
        except Exception as e:
            logger.error(f"Prediction test failed: {e}")

# Run validation (for testing)
if __name__ == "__main__":
    validator = ModelValidator("fish_stock_model.pkl")
    validator.inspect_model()
    validator.validate_input()
    validator.test_prediction()