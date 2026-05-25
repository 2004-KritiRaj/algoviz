# AlgoViz 🔬

> An interactive algorithm visualizer built with React — watch sorting, graph traversal, and binary search algorithms come to life with step-by-step animation.

🔗 **[Live Demo](https://YOUR_VERCEL_LINK.vercel.app)**

![AlgoViz Preview](./screenshots/preview.png)

---

## ✨ Features

- **5 Sorting Algorithms** — Bubble, Insertion, Selection, Merge, Quick Sort
- **Graph Traversal** — BFS and DFS with live queue/stack visualization
- **Binary Search** — Step-by-step pointer animation with search log
- **Quiz Mode** — Watch an animation and guess the algorithm (with timer + scoring)
- **Sound Effects** — Pitch-mapped audio feedback for compare, swap and sorted events
- **Speed Control** — Adjust animation speed in real time
- **Pause / Resume** — Stop mid-animation and continue from the same step
- **Step Counter** — Progress bar showing current step out of total
- **Complexity Panel** — Time and space complexity for every algorithm
- **Fully Responsive** — Works on mobile, tablet and desktop

---

## 🛠 Tech Stack

| Tech | Purpose |
|---|---|
| React 18 + Vite | Frontend framework + build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Web Audio API | Sound effects (no library) |
| SVG | Graph node/edge rendering |
| Vercel | Deployment |

---

## 📁 Project Structure

```
src/
  algorithms/       # Pure step-generator functions
    bubbleSort.js
    insertionSort.js
    selectionSort.js
    mergeSort.js
    quickSort.js
    binarySearch.js
    bfs.js
    dfs.js
  components/       # React UI components
    Visualizer.jsx
    GraphVisualizer.jsx
    BinarySearchVisualizer.jsx
    QuizMode.jsx
    GraphNode.jsx
    ArrayBar.jsx
  hooks/            # Custom React hooks
    useStepPlayer.js
    useSound.js
  utils/            # Helper functions
    arrayUtils.js
  data/             # Graph structure
    graphData.js
```

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/algoviz.git
cd algoviz

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🧠 Architecture

The core design decision: **algorithms are completely decoupled from animation**.

Every algorithm returns an array of "steps" describing what happened:
```js
{ type: "compare", indices: [3, 4], array: [...] }
{ type: "swap",    indices: [3, 4], array: [...] }
{ type: "sorted",  index: 4,        array: [...] }
```

A custom `useStepPlayer` hook then plays these steps one by one with configurable speed, pause, and resume — without the algorithm knowing anything about React or animation.

This means adding a new algorithm is as simple as writing a step-generator function and plugging it in.

---

## 📸 Screenshots

| Sorting | Graph | Quiz |
|---|---|---|
| ![Sorting](./screenshots/sorting.png) | ![Graph](./screenshots/graph.png) | ![Quiz](./screenshots/quiz.png) |

---

## 🙌

Made by KRITI RAJ...