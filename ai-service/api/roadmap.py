from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from prediction.roadmap import generate_roadmap

router = APIRouter()

class RoadmapRequest(BaseModel):
    weak_topics: List[str]

class RoadmapResponse(BaseModel):
    roadmap: List[Dict[str, Any]]

@router.post("/", response_model=RoadmapResponse)
def get_roadmap(req: RoadmapRequest):
    roadmap = generate_roadmap(req.weak_topics)
    return {"roadmap": roadmap}
