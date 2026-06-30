from typing import Dict, Any, List
import random

ARCHETYPES = [
    "The Sprinter", 
    "The Grinder", 
    "The Generalist", 
    "The Specialist", 
    "The Theorist"
]

def generate_twin_profile(
    total_solved: int, 
    contest_rating: float, 
    strong_topics: List[str], 
    weak_topics: List[str]
) -> Dict[str, Any]:
    """
    Generate a coding twin persona based on user stats.
    """
    # Simple rule-based generation for MVP
    if contest_rating > 1800:
        archetype = "The Sprinter"
        persona = "You code fast and perform well under pressure."
    elif total_solved > 500:
        archetype = "The Grinder"
        persona = "You have unmatched persistence and volume of practice."
    elif len(strong_topics) > 5:
        archetype = "The Generalist"
        persona = "You have a broad understanding of many different algorithms."
    elif len(strong_topics) > 0 and len(weak_topics) > 5:
        archetype = "The Specialist"
        persona = "You are deeply skilled in a few areas but need to expand your breadth."
    else:
        archetype = "The Theorist"
        persona = "You focus on understanding the concepts before diving into code."
        
    return {
        "archetype": archetype,
        "persona": persona,
        "learning_style": "Visual and practical" if "Graph" in strong_topics or "Tree" in strong_topics else "Abstract and logical",
        "strengths": strong_topics[:3] if strong_topics else ["Determined"],
        "weaknesses": weak_topics[:3] if weak_topics else ["Needs more data"]
    }
