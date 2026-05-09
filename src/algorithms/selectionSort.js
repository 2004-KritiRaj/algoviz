export function getSelectionSortSteps(array) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "compare", indices: [minIdx, j], array: [...arr] });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({ type: "swap", indices: [i, minIdx], array: [...arr] });
    }

    steps.push({ type: "sorted", index: i, array: [...arr] });
  }

  steps.push({ type: "done", array: [...arr] });
  return steps;
}