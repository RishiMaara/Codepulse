from fastapi import APIRouter
from pydantic import BaseModel
from prediction.predict_rating import predict_rating

router = APIRouter()

class RatingPredictionRequest(BaseModel):
    weekly_solves: float
    hard_ratio: float
    contest_frequency: float
    streak: int
    total_solved: int

class RatingPredictionResponse(BaseModel):
    predicted_rating: float

@router.post("/", response_model=RatingPredictionResponse)
def get_rating_prediction(req: RatingPredictionRequest):
    rating = predict_rating(
        weekly_solves=req.weekly_solves,
        hard_ratio=req.hard_ratio,
        contest_frequency=req.contest_frequency,
        streak=req.streak,
        total_solved=req.total_solved
    )
    return {"predicted_rating": rating}
