export function getMergeSortSteps(array) {
  const arr = [...array];
  const steps = [];

  function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ type: "compare", indices: [left + i, mid + 1 + j], array: [...arr] });
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]; i++;
      } else {
        arr[k] = rightArr[j]; j++;
      }
      steps.push({ type: "overwrite", index: k, array: [...arr] });
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({ type: "overwrite", index: k, array: [...arr] });
      i++; k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({ type: "overwrite", index: k, array: [...arr] });
      j++; k++;
    }
  }

  function mergeSort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
    // mark this section as sorted
    for (let i = left; i <= right; i++) {
      steps.push({ type: "sorted", index: i, array: [...arr] });
    }
  }

  mergeSort(arr, 0, arr.length - 1);
  steps.push({ type: "done", array: [...arr] });
  return steps;
}