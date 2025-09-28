# inspect_model.py
import joblib

path = r"D:\OceanAI\client\src\Backend\models\oceanai_model_v1.pkl"
m = joblib.load(path)
print("Type:", type(m))
if isinstance(m, dict):
    print("Dict keys:", list(m.keys()))
    for k, v in m.items():
        print(f"  {k}: {type(v)}")
