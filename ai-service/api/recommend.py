from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from prediction.recommend import recommend

router = APIRouter()

class RecommendRequest(BaseModel):
    weak_topics: List[str]

class RecommendResponse(BaseModel):
    questions: List[str]

@router.post("/", response_model=RecommendResponse)
def get_recommendations(req: RecommendRequest):
    questions = recommend(req.weak_topics)
    return {"questions": questions}
