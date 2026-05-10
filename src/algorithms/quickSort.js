export function getQuickSortSteps(array) {
  const arr = [...array];
  const steps = [];

  function partition(arr, low, high) {
    const pivot = arr[high];
    steps.push({ type: "pivot", index: high, array: [...arr] });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({ type: "compare", indices: [j, high], array: [...arr] });
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ type: "swap", indices: [i, j], array: [...arr] });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ type: "swap", indices: [i + 1, high], array: [...arr] });
    steps.push({ type: "sorted", index: i + 1, array: [...arr] });
    return i + 1;
  }

  function quickSort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    } else if (low === high) {
      steps.push({ type: "sorted", index: low, array: [...arr] });
    }
  }

  quickSort(arr, 0, arr.length - 1);
  steps.push({ type: "done", array: [...arr] });
  return steps;
}