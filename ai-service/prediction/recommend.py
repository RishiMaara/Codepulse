from typing import List, Dict

TOPIC_MAP: Dict[str, List[str]] = {
    "DP": [
        "Coin Change",
        "House Robber",
        "Climbing Stairs",
        "Unique Paths",
        "Longest Common Subsequence",
        "Edit Distance",
    ],
    "Graph": [
        "Number of Islands",
        "Course Schedule",
        "Clone Graph",
        "Word Ladder",
        "Pacific Atlantic Water Flow",
    ],
    "Tree": [
        "Diameter of Binary Tree",
        "Balanced Binary Tree",
        "LCA of Binary Search Tree",
        "Serialize and Deserialize Binary Tree",
    ],
    "Segment Tree": [
        "Range Sum Query – Mutable",
        "Count of Range Sum",
        "My Calendar I",
    ],
    "Greedy": [
        "Jump Game",
        "Gas Station",
        "Task Scheduler",
        "Candy",
    ],
    "Sliding Window": [
        "Longest Substring Without Repeating Characters",
        "Minimum Window Substring",
        "Permutation in String",
    ],
    "Binary Search": [
        "Search in Rotated Sorted Array",
        "Find Minimum in Rotated Sorted Array",
        "Median of Two Sorted Arrays",
    ],
    "Heap": [
        "Find Median from Data Stream",
        "Top K Frequent Elements",
        "Merge K Sorted Lists",
    ],
    "Backtracking": [
        "Subsets",
        "Permutations",
        "N-Queens",
        "Word Search",
    ],
    "Two Pointers": [
        "3Sum",
        "Container With Most Water",
        "Trapping Rain Water",
    ],
}


def recommend(weak_topics: List[str], limit: int = 5) -> List[str]:
    """Return up to `limit` problems targeting the given weak topics."""
    result: List[str] = []
    for topic in weak_topics:
        problems = TOPIC_MAP.get(topic, [])
        result.extend(problems)
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for p in result:
        if p not in seen:
            seen.add(p)
            unique.append(p)
    return unique[:limit]
