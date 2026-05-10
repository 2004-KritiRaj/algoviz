import { useState, useRef } from "react";
import ArrayBar from "./ArrayBar";
import { generateRandomArray } from "../utils/arrayUtils";
import { getBubbleSortSteps } from "../algorithms/bubbleSort";
import { getInsertionSortSteps } from "../algorithms/insertionSort";
import { getSelectionSortSteps } from "../algorithms/selectionSort";
import { getMergeSortSteps } from "../algorithms/mergeSort";
import { getQuickSortSteps } from "../algorithms/quickSort";

const ALGOS = {
  bubble: {
    name: "Bubble Sort", fn: getBubbleSortSteps,
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Repeatedly swaps adjacent elements that are in the wrong order.",
    color: "#7DA0CA",
  },
  insertion: {
    name: "Insertion Sort", fn: getInsertionSortSteps,
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Builds a sorted array one element at a time by inserting into correct position.",
    color: "#52B788",
  },
  selection: {
    name: "Selection Sort", fn: getSelectionSortSteps,
    best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Finds the minimum element repeatedly and places it at the beginning each pass.",
    color: "#FFB347",
  },
  merge: {
    name: "Merge Sort", fn: getMergeSortSteps,
    best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)",
    desc: "Divides array in half recursively, then merges sorted halves back together.",
    color: "#C77DFF",
  },
  quick: {
    name: "Quick Sort", fn: getQuickSortSteps,
    best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)",
    desc: "Picks a pivot, partitions elements around it, and recurses on both sides.",
    color: "#FF9F43",
  },
};

const ALGO_COLORS = {
  bubble:    { default: "#5483B3", comparing: "#C1E8FF", swapping: "#FF6B6B", sorted: "#7DA0CA", pivot: "#FACC15" },
  insertion: { default: "#3A7D44", comparing: "#A8D8A8", swapping: "#FF6B6B", sorted: "#52B788", pivot: "#FACC15" },
  selection: { default: "#A0522D", comparing: "#FFD9A0", swapping: "#FF6B6B", sorted: "#FFB347", pivot: "#FACC15" },
  merge:     { default: "#6A0DAD", comparing: "#C77DFF", swapping: "#E0AAFF", sorted: "#9D4EDD", pivot: "#FACC15" },
  quick:     { default: "#B5451B", comparing: "#FFD9A0", swapping: "#FF6B6B", sorted: "#FF9F43", pivot: "#FACC15" },
};

export default function Visualizer() {
  const [array, setArray]       = useState(() => generateRandomArray(50));
  const [arraySize, setArraySize] = useState(50);
  const [barColors, setBarColors] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed]       = useState(50);
  const [algo, setAlgo]         = useState("bubble");
  const timeoutsRef             = useRef([]);

  const maxValue  = Math.max(...array);
  const info      = ALGOS[algo];
  const palette   = ALGO_COLORS[algo];

  function handleNewArray() {
    timeoutsRef.current.forEach(clearTimeout);
    setBarColors({});
    setIsRunning(false);
    setArray(generateRandomArray(arraySize));
  }

  function handleSizeChange(e) {
    const s = Number(e.target.value);
    setArraySize(s);
    setArray(generateRandomArray(s));
    setBarColors({});
    setIsRunning(false);
  }

  function handleAlgoChange(newAlgo) {
    if (isRunning) return;
    setAlgo(newAlgo);
    setBarColors({});
    setArray(generateRandomArray(arraySize));
  }

  function handleVisualize() {
    if (isRunning) return;
    setIsRunning(true);
    const steps = info.fn(array);
    const delay = 105 - speed;

    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        if (step.type === "compare") {
          setBarColors(prev => {
            const next = { ...prev };
            step.indices.forEach(idx => (next[idx] = "comparing"));
            return next;
          });
        } else if (step.type === "swap") {
          setArray([...step.array]);
          setBarColors(prev => {
            const next = { ...prev };
            step.indices.forEach(idx => (next[idx] = "swapping"));
            return next;
          });
        } else if (step.type === "overwrite") {
          setArray([...step.array]);
          setBarColors(prev => ({ ...prev, [step.index]: "swapping" }));
        } else if (step.type === "pivot") {
          setBarColors(prev => ({ ...prev, [step.index]: "pivot" }));
        } else if (step.type === "sorted") {
          setBarColors(prev => ({ ...prev, [step.index]: "sorted" }));
        } else if (step.type === "done") {
          setArray([...step.array]);
          setBarColors({});
          setIsRunning(false);
        }
      }, i * delay);
      timeoutsRef.current.push(t);
    });
  }

  function handleReset() {
    timeoutsRef.current.forEach(clearTimeout);
    setBarColors({});
    setIsRunning(false);
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 md:p-6"
      style={{
        background: "linear-gradient(135deg, #021024 0%, #052659 60%, #5483B3 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Navbar — no badge */}
      <div className="w-full max-w-screen-xl flex items-center mb-6 md:mb-8">
        <h1
          className="font-bold tracking-widest"
          style={{
            fontSize: "clamp(20px, 3vw, 32px)",
            color: "#C1E8FF",
            textShadow: "0 0 30px rgba(193,232,255,0.4)",
            letterSpacing: "0.2em",
          }}
        >
          ALGO<span style={{ color: "#7DA0CA" }}>VIZ</span>
        </h1>
      </div>

      {/* Algorithm Selector */}
      <div className="w-full max-w-screen-xl flex gap-2 mb-5 flex-wrap">
        {Object.entries(ALGOS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleAlgoChange(key)}
            disabled={isRunning}
            style={{
              flex: "1 1 120px",
              padding: "10px 8px",
              borderRadius: "12px",
              fontSize: "clamp(10px, 1.4vw, 13px)",
              fontWeight: "600",
              cursor: isRunning ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              background: algo === key
                ? `linear-gradient(135deg, ${val.color}33, ${val.color}55)`
                : "rgba(5,38,89,0.5)",
              border: algo === key
                ? `1.5px solid ${val.color}`
                : "1px solid rgba(84,131,179,0.3)",
              color: algo === key ? val.color : "#5483B3",
              boxShadow: algo === key ? `0 4px 20px ${val.color}33` : "none",
              transform: algo === key ? "translateY(-2px)" : "none",
            }}
          >
            {val.name}
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 md:p-5 mb-4"
        style={{
          background: "rgba(5,38,89,0.6)",
          border: `1px solid ${info.color}44`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 8px 32px rgba(2,16,36,0.5)`,
          transition: "border-color 0.4s",
        }}
      >
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <div style={{ flex: "1 1 200px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: info.color, marginBottom: "4px" }}>
              ALGORITHM
            </p>
            <p style={{ fontSize: "clamp(14px,2vw,18px)", fontWeight: "700", color: "#C1E8FF" }}>
              {info.name}
            </p>
            <p style={{ fontSize: "clamp(10px,1.2vw,12px)", color: "#7DA0CA", marginTop: "4px", maxWidth: "360px" }}>
              {info.desc}
            </p>
          </div>
          <div style={{ display: "flex", gap: "clamp(10px,2vw,24px)", flexWrap: "wrap", alignItems: "center" }}>
            {[
              { label: "BEST",    value: info.best },
              { label: "AVERAGE", value: info.average },
              { label: "WORST",   value: info.worst },
              { label: "SPACE",   value: info.space },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "8px", color: "#5483B3", marginBottom: "2px" }}>{label}</p>
                <p style={{ fontSize: "clamp(11px,1.5vw,16px)", fontFamily: "monospace", fontWeight: "700", color: info.color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 mb-4 flex flex-wrap gap-4 items-center justify-between"
        style={{
          background: "rgba(5,38,89,0.5)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleNewArray}
            disabled={isRunning}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "600",
              background: "rgba(193,232,255,0.08)",
              border: "1px solid rgba(193,232,255,0.25)",
              color: "#C1E8FF", cursor: isRunning ? "not-allowed" : "pointer",
            }}
          >
            New Array
          </button>
          <button
            onClick={handleVisualize}
            disabled={isRunning}
            style={{
              padding: "8px 20px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "700",
              background: isRunning
                ? "rgba(84,131,179,0.3)"
                : `linear-gradient(135deg, ${info.color}, #C1E8FF)`,
              border: "none",
              color: "#021024", cursor: isRunning ? "not-allowed" : "pointer",
              boxShadow: isRunning ? "none" : `0 4px 20px ${info.color}66`,
              transition: "all 0.3s",
            }}
          >
            {isRunning ? "Running..." : "▶ Visualize"}
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "600",
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              color: "#FF6B6B", cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Sliders */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.08em" }}>
              ARRAY SIZE — {arraySize}
            </label>
            <input type="range" min="10" max="100" value={arraySize}
              onChange={handleSizeChange} disabled={isRunning}
              style={{ accentColor: "#7DA0CA", width: "clamp(80px,10vw,130px)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.08em" }}>
              SPEED — {speed}
            </label>
            <input type="range" min="1" max="100" value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              style={{ accentColor: "#7DA0CA", width: "clamp(80px,10vw,130px)" }} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { label: "Default",   key: "default" },
            { label: "Comparing", key: "comparing" },
            { label: "Swapping",  key: "swapping" },
            { label: "Pivot",     key: "pivot" },
            { label: "Sorted",    key: "sorted" },
          ].map(({ label, key }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{
                width: "10px", height: "10px", borderRadius: "2px",
                background: palette[key],
                boxShadow: key === "pivot" ? "0 0 6px rgba(250,204,21,0.8)" : "none",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: "clamp(9px,1vw,11px)", color: "#7DA0CA" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizer */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 md:p-6"
        style={{
          background: "rgba(2,16,36,0.75)",
          border: `1px solid ${info.color}33`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 20px 60px rgba(2,16,36,0.8)`,
          height: "clamp(220px, 40vh, 450px)",
          transition: "border-color 0.4s",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "100%", width: "100%" }}>
          {array.map((value, index) => {
            const colorKey = barColors[index] || "default";
            const barColor = palette[colorKey];
            const glow =
              colorKey === "comparing" ? `0 0 8px ${palette.comparing}99` :
              colorKey === "swapping"  ? "0 0 8px rgba(255,107,107,0.8)" :
              colorKey === "pivot"     ? "0 0 10px rgba(250,204,21,0.9)" : "none";
            return (
              <div key={index} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%",
                  height: `${(value / maxValue) * 100}%`,
                  background: barColor,
                  boxShadow: glow,
                  borderRadius: "2px 2px 0 0",
                  transition: "height 0.08s, background 0.1s",
                }} />
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ marginTop: "12px", fontSize: "10px", color: "#5483B3" }}>
        {array.length} elements · {info.name} · AlgoViz © 2025
      </p>
    </div>
  );
}