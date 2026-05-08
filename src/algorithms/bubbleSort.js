export function getBubbleSortSteps(array) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: "compare", indices: [j, j + 1], array: [...arr] });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ type: "swap", indices: [j, j + 1], array: [...arr] });
      }
    }
    steps.push({ type: "sorted", index: n - 1 - i, array: [...arr] });
  }
  steps.push({ type: "done", array: [...arr] });
  return steps;
}