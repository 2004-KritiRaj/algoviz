import { useState, useRef } from "react";
import ArrayBar from "./ArrayBar";
import { generateRandomArray } from "../utils/arrayUtils";
import { getBubbleSortSteps } from "../algorithms/bubbleSort";
import { getInsertionSortSteps } from "../algorithms/insertionSort";
import { getSelectionSortSteps } from "../algorithms/selectionSort";

const ALGOS = {
  bubble: {
    name: "Bubble Sort",
    fn: getBubbleSortSteps,
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Repeatedly swaps adjacent elements that are in the wrong order.",
    color: "#7DA0CA",
  },
  insertion: {
    name: "Insertion Sort",
    fn: getInsertionSortSteps,
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Builds a sorted array one element at a time by inserting into position.",
    color: "#A8D8A8",
  },
  selection: {
    name: "Selection Sort",
    fn: getSelectionSortSteps,
    best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Finds the minimum element and places it at the beginning each pass.",
    color: "#FFB347",
  },
};

const ALGO_COLORS = {
  bubble:    { default: "#5483B3", comparing: "#C1E8FF", swapping: "#FF6B6B", sorted: "#7DA0CA" },
  insertion: { default: "#3A7D44", comparing: "#A8D8A8", swapping: "#FF6B6B", sorted: "#52B788" },
  selection: { default: "#A0522D", comparing: "#FFD9A0", swapping: "#FF6B6B", sorted: "#FFB347" },
};

export default function Visualizer() {
  const [array, setArray] = useState(() => generateRandomArray(50));
  const [arraySize, setArraySize] = useState(50);
  const [barColors, setBarColors] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algo, setAlgo] = useState("bubble");
  const timeoutsRef = useRef([]);

  const maxValue = Math.max(...array);
  const info = ALGOS[algo];
  const palette = ALGO_COLORS[algo];

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
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #021024 0%, #052659 60%, #5483B3 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Navbar */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1
          className="text-3xl font-bold tracking-widest"
          style={{ color: "#C1E8FF", textShadow: "0 0 30px rgba(193,232,255,0.4)", letterSpacing: "0.2em" }}
        >
          ALGO<span style={{ color: "#7DA0CA" }}>VIZ</span>
        </h1>
        <span className="text-sm px-4 py-1 rounded-full border" style={{ borderColor: "#5483B3", color: "#7DA0CA" }}>
          Day 4 — 3 Algorithms
        </span>
      </div>

      {/* Algorithm Selector */}
      <div className="w-full max-w-6xl flex gap-3 mb-6 flex-wrap">
        {Object.entries(ALGOS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleAlgoChange(key)}
            disabled={isRunning}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: algo === key
                ? `linear-gradient(135deg, ${val.color}33, ${val.color}55)`
                : "rgba(5,38,89,0.5)",
              border: algo === key
                ? `1.5px solid ${val.color}`
                : "1px solid rgba(84,131,179,0.3)",
              color: algo === key ? val.color : "#5483B3",
              cursor: isRunning ? "not-allowed" : "pointer",
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
        className="w-full max-w-6xl rounded-2xl p-5 mb-5"
        style={{
          background: "rgba(5,38,89,0.6)",
          border: `1px solid ${info.color}44`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 8px 32px rgba(2,16,36,0.5), 0 0 0 1px ${info.color}11`,
          transition: "all 0.4s ease",
        }}
      >
        <div className="flex flex-wrap gap-6 justify-between items-start">
          <div>
            <p className="text-xs mb-1" style={{ color: info.color, letterSpacing: "0.1em" }}>ALGORITHM</p>
            <p className="text-xl font-bold" style={{ color: "#C1E8FF" }}>{info.name}</p>
            <p className="text-sm mt-1 max-w-sm" style={{ color: "#7DA0CA" }}>{info.desc}</p>
          </div>
          <div className="flex gap-6 flex-wrap">
            {[
              { label: "BEST", value: info.best },
              { label: "AVERAGE", value: info.average },
              { label: "WORST", value: info.worst },
              { label: "SPACE", value: info.space },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xs mb-1" style={{ color: "#5483B3" }}>{label}</p>
                <p className="text-lg font-mono font-bold" style={{ color: info.color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="w-full max-w-6xl rounded-2xl p-5 mb-5 flex flex-wrap gap-6 items-center justify-between"
        style={{
          background: "rgba(5,38,89,0.5)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleNewArray}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl font-semibold text-sm"
            style={{
              background: "rgba(193,232,255,0.08)",
              border: "1px solid rgba(193,232,255,0.25)",
              color: "#C1E8FF",
              cursor: isRunning ? "not-allowed" : "pointer",
            }}
          >
            New Array
          </button>
          <button
            onClick={handleVisualize}
            disabled={isRunning}
            className="px-6 py-2 rounded-xl font-semibold text-sm"
            style={{
              background: isRunning ? "rgba(84,131,179,0.3)" : `linear-gradient(135deg, ${info.color}, #C1E8FF)`,
              border: "none",
              color: "#021024",
              cursor: isRunning ? "not-allowed" : "pointer",
              fontWeight: "700",
              boxShadow: isRunning ? "none" : `0 4px 20px ${info.color}66`,
              transition: "all 0.3s",
            }}
          >
            {isRunning ? "Running..." : "▶ Visualize"}
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-xl font-semibold text-sm"
            style={{
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              color: "#FF6B6B",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        <div className="flex gap-8 flex-wrap items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "#5483B3" }}>ARRAY SIZE — {arraySize}</label>
            <input type="range" min="10" max="100" value={arraySize} onChange={handleSizeChange}
              disabled={isRunning} className="w-36 accent-[#7DA0CA]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "#5483B3" }}>SPEED — {speed}</label>
            <input type="range" min="1" max="100" value={speed}
              onChange={e => setSpeed(Number(e.target.value))} className="w-36 accent-[#7DA0CA]" />
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Default", key: "default" },
            { label: "Comparing", key: "comparing" },
            { label: "Swapping", key: "swapping" },
            { label: "Sorted", key: "sorted" },
          ].map(({ label, key }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: palette[key] }} />
              <span className="text-xs" style={{ color: "#7DA0CA" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizer */}
      <div
        className="w-full max-w-6xl rounded-2xl p-6"
        style={{
          background: "rgba(2,16,36,0.75)",
          border: `1px solid ${info.color}33`,
          backdropFilter: "blur(10px)",
          boxShadow: `0 20px 60px rgba(2,16,36,0.8), inset 0 1px 0 ${info.color}11`,
          height: "420px",
          transition: "border-color 0.4s ease",
        }}
      >
        <div className="flex items-end gap-[2px] h-full w-full">
          {array.map((value, index) => {
            const colorKey = barColors[index] || "default";
            const barColor = palette[colorKey];
            const glow = colorKey === "comparing"
              ? `0 0 8px ${palette.comparing}99`
              : colorKey === "swapping"
              ? `0 0 8px ${palette.swapping}99`
              : "none";

            return (
              <div key={index} className="flex-1 h-full flex items-end">
                <div
                  className="rounded-t-[3px] transition-all duration-75 w-full"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    background: barColor,
                    boxShadow: glow,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs" style={{ color: "#5483B3" }}>
        {array.length} elements · {info.name} · AlgoViz © 2025
      </p>
    </div>
  );
}