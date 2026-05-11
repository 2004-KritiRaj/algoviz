export function getBFSSteps(startNode, adjacencyList) {
  const steps = [];
  const visited = new Set();
  const queue = [startNode];
  const inQueue = new Set([startNode]);

  steps.push({
    type: "enqueue",
    node: startNode,
    queue: [...queue],
    visited: [],
  });

  while (queue.length > 0) {
    const current = queue.shift();
    visited.add(current);

    steps.push({
      type: "visit",
      node: current,
      queue: [...queue],
      visited: [...visited],
    });

    for (const neighbour of adjacencyList[current]) {
      if (!visited.has(neighbour) && !inQueue.has(neighbour)) {
        queue.push(neighbour);
        inQueue.add(neighbour);
        steps.push({
          type: "enqueue",
          node: neighbour,
          queue: [...queue],
          visited: [...visited],
        });
      }
    }
  }

  steps.push({ type: "done", visited: [...visited] });
  return steps;
}