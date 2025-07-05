let array = [];
let arraySize = 50;
let stepCount = 0;
let comparisonCount = 0;
let isPaused = false;
let isStopped = false;

const algoDescriptions = {
  bubbleSort: "Bubble Sort: Repeatedly compares adjacent elements and swaps them if needed.",
  selectionSort: "Selection Sort: Selects the minimum and places it in the correct position.",
  insertionSort: "Insertion Sort: Builds a sorted section one element at a time.",
  mergeSort: "Merge Sort: Divides array into halves and merges them in order.",
  quickSort: "Quick Sort: Partitions array using a pivot and sorts recursively.",
};

function sleep(ms) {
  return new Promise(resolve => {
    const check = () => {
      if (isStopped) return resolve();
      if (!isPaused) return setTimeout(resolve, ms);
      setTimeout(check, 50); // Check every 50ms if resumed
    };
    check();
  });
}

function updateMetrics() {
  document.getElementById("stepCount").innerText = `Steps: ${stepCount}`;
  document.getElementById("comparisonCount").innerText = `Comparisons: ${comparisonCount}`;
}

function drawArray(highlight = -1, sortedIndex = -1) {
  const container = document.getElementById("array");
  container.innerHTML = "";
  array.forEach((height, i) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${height}px`;
    if (i === highlight) bar.style.background = "#e94560";
    else if (i <= sortedIndex) bar.style.background = "#4caf50";
    container.appendChild(bar);
  });
}

function getSpeed() {
  return 101 - document.getElementById("speed").value;
}

function generateArray() {
  arraySize = parseInt(document.getElementById("size").value);
  array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 300) + 20);
  stepCount = 0;
  comparisonCount = 0;
  isStopped = false;
  isPaused = false;
  updateMetrics();
  drawArray();
}

async function startSort() {
  isStopped = false;
  isPaused = false;
  stepCount = 0;
  comparisonCount = 0;
  updateMetrics();
  const algo = document.getElementById("algorithm").value;
  document.getElementById("algoInfo").innerText = algoDescriptions[algo] || "";
  if (algo === "bubbleSort") await bubbleSort();
  else if (algo === "selectionSort") await selectionSort();
  else if (algo === "insertionSort") await insertionSort();
  else if (algo === "mergeSort") await mergeSortWrapper();
  else if (algo === "quickSort") await quickSortWrapper();
  drawArray();
}

function pauseSort() {
  isPaused = true;
}

function resumeSort() {
  isPaused = false;
}

function stopSort() {
  isStopped = true;
  generateArray(); // Reset everything
}

async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (isStopped) return;
      comparisonCount++;
      drawArray(j);
      await sleep(getSpeed());
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        stepCount++;
        updateMetrics();
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      if (isStopped) return;
      comparisonCount++;
      drawArray(j);
      await sleep(getSpeed());
      if (array[j] < array[minIdx]) minIdx = j;
    }
    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    stepCount++;
    updateMetrics();
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (isStopped) return;
      comparisonCount++;
      drawArray(j);
      await sleep(getSpeed());
      array[j + 1] = array[j];
      j--;
      stepCount++;
      updateMetrics();
    }
    array[j + 1] = key;
    stepCount++;
    updateMetrics();
  }
}

async function mergeSortWrapper() {
  await mergeSort(0, array.length - 1);
}

async function mergeSort(start, end) {
  if (start >= end || isStopped) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    if (isStopped) return;
    comparisonCount++;
    array[k++] = left[i] < right[j] ? left[i++] : right[j++];
    drawArray(k);
    await sleep(getSpeed());
    stepCount++;
    updateMetrics();
  }
  while (i < left.length) array[k++] = left[i++];
  while (j < right.length) array[k++] = right[j++];
}

async function quickSortWrapper() {
  await quickSort(0, array.length - 1);
}

async function quickSort(low, high) {
  if (low < high && !isStopped) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (isStopped) return;
    comparisonCount++;
    drawArray(j);
    await sleep(getSpeed());
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      stepCount++;
      updateMetrics();
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  stepCount++;
  updateMetrics();
  return i + 1;
}

generateArray();
