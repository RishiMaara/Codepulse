"""
XGBoost Contest Rating Predictor
---------------------------------
Features used:
  - weekly_solves      : average problems solved per week
  - hard_ratio         : hard problems / total solved
  - contest_frequency  : contests attended per month
  - streak             : current streak (days)
  - total_solved       : total problems solved

Training: run `python training/train_rating.py` to generate models/rating_predictor.pkl
"""
import os
import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent / "models" / "rating_predictor.pkl"


def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None


_model = load_model()


def predict_rating(
    weekly_solves: float,
    hard_ratio: float,
    contest_frequency: float,
    streak: int,
    total_solved: int,
) -> float:
    """
    Predict contest rating from coding features.
    Falls back to heuristic formula if model not trained yet.
    """
    if _model is not None:
        features = np.array([[weekly_solves, hard_ratio, contest_frequency, streak, total_solved]])
        return float(_model.predict(features)[0])

    # ── Heuristic fallback (before model is trained) ──────────────────────
    base = 1200
    base += weekly_solves * 15
    base += hard_ratio * 400
    base += contest_frequency * 50
    base += min(streak * 2, 100)
    base += min(total_solved * 0.5, 300)
    return round(min(base, 3500), 1)
