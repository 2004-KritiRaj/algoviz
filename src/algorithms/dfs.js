export function getDFSSteps(startNode, adjacencyList) {
  const steps = [];
  const visited = new Set();
  const stack = [startNode];
  const inStack = new Set([startNode]);

  steps.push({
    type: "push",
    node: startNode,
    stack: [...stack],
    visited: [],
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    steps.push({
      type: "visit",
      node: current,
      stack: [...stack],
      visited: [...visited],
    });

    const neighbours = [...adjacencyList[current]].reverse();
    for (const neighbour of neighbours) {
      if (!visited.has(neighbour)) {
        stack.push(neighbour);
        inStack.add(neighbour);
        steps.push({
          type: "push",
          node: neighbour,
          stack: [...stack],
          visited: [...visited],
        });
      }
    }
  }

  steps.push({ type: "done", visited: [...visited] });
  return steps;
}