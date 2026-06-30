from typing import List, Dict, Any


def generate_roadmap(weak_topics: List[str], problems_per_week: int = 10) -> List[Dict[str, Any]]:
    """
    Generate a week-by-week study roadmap.
    Each week focuses on one weak topic with a daily target.
    """
    return [
        {
            "week": i + 1,
            "focus": topic,
            "problems": problems_per_week,
            "daily_target": problems_per_week // 7,
            "tip": _get_tip(topic),
        }
        for i, topic in enumerate(weak_topics)
    ]


_TIPS: Dict[str, str] = {
    "DP":             "Start with 1D DP (Fibonacci, Climbing Stairs), then move to 2D (Grid DP, LCS).",
    "Graph":          "Master BFS/DFS first, then topological sort and Dijkstra.",
    "Tree":           "Practice recursive DFS patterns before iterative solutions.",
    "Greedy":         "Always prove why the greedy choice is globally optimal.",
    "Binary Search":  "Think in terms of invariants — what stays true at each iteration?",
    "Heap":           "Know when to use min-heap vs max-heap. Practice K-th element problems.",
    "Backtracking":   "Draw the recursion tree first before coding.",
    "Sliding Window": "Identify the window expansion and shrink conditions clearly.",
    "Two Pointers":   "Sort first, then apply two-pointer from opposite ends.",
    "Segment Tree":   "Understand lazy propagation for range update problems.",
}


def _get_tip(topic: str) -> str:
    return _TIPS.get(topic, f"Focus on understanding the core pattern for {topic}.")
