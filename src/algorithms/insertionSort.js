export function getInsertionSortSteps(array) {
  const arr = [...array];
  const steps = [];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      steps.push({ type: "compare", indices: [j, j - 1], array: [...arr] });
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        steps.push({ type: "swap", indices: [j, j - 1], array: [...arr] });
        j--;
      } else {
        break;
      }
    }
    steps.push({ type: "sorted", index: i, array: [...arr] });
  }

  steps.push({ type: "done", array: [...arr] });
  return steps;
}