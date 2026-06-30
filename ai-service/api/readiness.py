from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from prediction.readiness import analyze_readiness

router = APIRouter()

class ReadinessRequest(BaseModel):
    readiness_score: int

class ReadinessResponse(BaseModel):
    status: str
    message: str
    action_items: list[str]

@router.post("/", response_model=ReadinessResponse)
def get_readiness_insights(req: ReadinessRequest):
    insights = analyze_readiness(req.readiness_score)
    return insights
