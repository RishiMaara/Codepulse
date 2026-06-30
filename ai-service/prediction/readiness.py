from typing import Dict, Any

def analyze_readiness(readiness_score: int) -> Dict[str, Any]:
    """
    Generate insights and actionable feedback based on the readiness score.
    """
    if readiness_score >= 85:
        return {
            "status": "Ready",
            "message": "You're in great shape! Focus on mock interviews and system design.",
            "action_items": [
                "Schedule 2-3 mock interviews per week.",
                "Review System Design fundamentals.",
                "Do 1-2 hard problems daily to stay sharp."
            ]
        }
    elif readiness_score >= 65:
        return {
            "status": "Getting Close",
            "message": "You have a solid foundation, but need more consistency and depth in harder topics.",
            "action_items": [
                "Participate in weekly contests to improve speed.",
                "Focus on your weak topics (e.g., DP, Graphs).",
                "Start timing your LeetCode sessions."
            ]
        }
    else:
        return {
            "status": "Needs Preparation",
            "message": "Focus on building a strong foundation in core data structures and algorithms.",
            "action_items": [
                "Complete a structured list like Blind 75 or NeetCode 150.",
                "Focus on Easy/Medium problems until you can solve them consistently in under 30 mins.",
                "Review solutions thoroughly even after solving."
            ]
        }
