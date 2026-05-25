export function getBinarySearchSteps(array, target) {
  // array must be sorted
  const arr = [...array].sort((a, b) => a - b);
  const steps = [];
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    type: "init",
    array: [...arr],
    left,
    right,
    mid: null,
    target,
    found: null,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      type: "check",
      array: [...arr],
      left,
      right,
      mid,
      target,
      found: null,
    });

    if (arr[mid] === target) {
      steps.push({
        type: "found",
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: mid,
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        type: "goRight",
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: null,
      });
      left = mid + 1;
    } else {
      steps.push({
        type: "goLeft",
        array: [...arr],
        left,
        right,
        mid,
        target,
        found: null,
      });
      right = mid - 1;
    }
  }

  steps.push({
    type: "notFound",
    array: [...arr],
    left: null,
    right: null,
    mid: null,
    target,
    found: -1,
  });

  return steps;
}