/** Counts topic frequency across a user's problem history */
export function calculateTopicCounts(
  problems: Array<{ topics: string[] }>
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of problems) {
    for (const topic of p.topics) {
      counts[topic] = (counts[topic] || 0) + 1;
    }
  }
  return counts;
}

/** Returns [topic, count] pairs sorted ascending (fewest first = weakest) */
export function rankTopicsAscending(
  counts: Record<string, number>
): [string, number][] {
  return Object.entries(counts).sort((a, b) => a[1] - b[1]);
}

/** Returns top N weak and strong topics */
export function getWeakAndStrong(
  problems: Array<{ topics: string[] }>,
  topN = 5
): { weakTopics: [string, number][]; strongTopics: [string, number][] } {
  const counts = calculateTopicCounts(problems);
  const sorted = rankTopicsAscending(counts);
  return {
    weakTopics:   sorted.slice(0, topN),
    strongTopics: sorted.slice(-topN).reverse(),
  };
}
