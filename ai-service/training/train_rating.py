"""
XGBoost Rating Predictor — Training Script
-------------------------------------------
Run: python training/train_rating.py

Generates: models/rating_predictor.pkl

Dataset format (CSV):
  weekly_solves, hard_ratio, contest_frequency, streak, total_solved, rating
"""
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from pathlib import Path

DATASET_PATH = Path(__file__).parent / "datasets" / "rating_data.csv"
MODEL_PATH   = Path(__file__).parent.parent / "models" / "rating_predictor.pkl"


def generate_synthetic_dataset(n: int = 2000) -> pd.DataFrame:
    """
    Generates synthetic training data for bootstrapping.
    Replace with real contest data for production accuracy.
    """
    np.random.seed(42)
    weekly_solves      = np.random.uniform(0, 30, n)
    hard_ratio         = np.random.uniform(0, 0.5, n)
    contest_frequency  = np.random.uniform(0, 4, n)
    streak             = np.random.randint(0, 365, n)
    total_solved       = np.random.randint(0, 600, n)

    # Approximate rating formula (ground truth)
    rating = (
        1200
        + weekly_solves * 15
        + hard_ratio * 400
        + contest_frequency * 50
        + np.minimum(streak * 2, 100)
        + np.minimum(total_solved * 0.5, 300)
        + np.random.normal(0, 80, n)  # noise
    ).clip(800, 3500)

    return pd.DataFrame({
        "weekly_solves":     weekly_solves,
        "hard_ratio":        hard_ratio,
        "contest_frequency": contest_frequency,
        "streak":            streak,
        "total_solved":      total_solved,
        "rating":            rating,
    })


def train():
    # Load or generate dataset
    if DATASET_PATH.exists():
        df = pd.read_csv(DATASET_PATH)
        print(f"Loaded dataset: {len(df)} rows")
    else:
        print("No dataset found. Generating synthetic data...")
        df = generate_synthetic_dataset()
        DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(DATASET_PATH, index=False)
        print(f"Saved synthetic dataset → {DATASET_PATH}")

    features = ["weekly_solves", "hard_ratio", "contest_frequency", "streak", "total_solved"]
    X = df[features]
    y = df["rating"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(n_estimators=200, max_depth=5, learning_rate=0.05, random_state=42)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    y_pred = model.predict(X_test)
    rmse   = mean_squared_error(y_test, y_pred, squared=False)
    r2     = r2_score(y_test, y_pred)

    print(f"\n✅ Training complete")
    print(f"   RMSE : {rmse:.2f}")
    print(f"   R²   : {r2:.4f}")

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"   Model saved → {MODEL_PATH}")


if __name__ == "__main__":
    train()
