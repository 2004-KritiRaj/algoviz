import { useState, useRef } from "react";
import ArrayBar from "./ArrayBar";
import { generateRandomArray } from "../utils/arrayUtils";
import { getBubbleSortSteps } from "../algorithms/bubbleSort";

const ALGO_INFO = {
  bubble: {
    name: "Bubble Sort",
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    desc: "Repeatedly swaps adjacent elements that are in the wrong order.",
  },
};

export default function Visualizer() {
  const [array, setArray] = useState(() => generateRandomArray(50));
  const [arraySize, setArraySize] = useState(50);
  const [barColors, setBarColors] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algo] = useState("bubble");
  const timeoutsRef = useRef([]);

  const maxValue = Math.max(...array);

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

  function handleVisualize() {
    if (isRunning) return;
    setIsRunning(true);
    const steps = getBubbleSortSteps(array);
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

  const info = ALGO_INFO[algo];

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #021024 0%, #052659 60%, #5483B3 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Navbar */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <h1
          className="text-3xl font-bold tracking-widest"
          style={{
            color: "#C1E8FF",
            textShadow: "0 0 30px rgba(193,232,255,0.4)",
            letterSpacing: "0.2em",
          }}
        >
          ALGO<span style={{ color: "#7DA0CA" }}>VIZ</span>
        </h1>
        <span
          className="text-sm px-4 py-1 rounded-full border"
          style={{ borderColor: "#5483B3", color: "#7DA0CA" }}
        >
          Bubble Sort
        </span>
      </div>

      {/* Info Card */}
      <div
        className="w-full max-w-6xl rounded-2xl p-5 mb-6 flex flex-wrap gap-6 justify-between items-start"
        style={{
          background: "rgba(5, 38, 89, 0.6)",
          border: "1px solid rgba(84,131,179,0.4)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(2,16,36,0.5), inset 0 1px 0 rgba(193,232,255,0.1)",
        }}
      >
        <div>
          <p className="text-xs mb-1" style={{ color: "#5483B3" }}>ALGORITHM</p>
          <p className="text-xl font-bold" style={{ color: "#C1E8FF" }}>{info.name}</p>
          <p className="text-sm mt-1 max-w-xs" style={{ color: "#7DA0CA" }}>{info.desc}</p>
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
              <p className="text-lg font-mono font-bold" style={{ color: "#C1E8FF" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        className="w-full max-w-6xl rounded-2xl p-5 mb-6 flex flex-wrap gap-6 items-center justify-between"
        style={{
          background: "rgba(5, 38, 89, 0.5)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleNewArray}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: isRunning ? "rgba(84,131,179,0.2)" : "rgba(193,232,255,0.15)",
              border: "1px solid rgba(193,232,255,0.3)",
              color: "#C1E8FF",
              cursor: isRunning ? "not-allowed" : "pointer",
              boxShadow: isRunning ? "none" : "0 4px 15px rgba(193,232,255,0.1)",
            }}
          >
            New Array
          </button>
          <button
            onClick={handleVisualize}
            disabled={isRunning}
            className="px-6 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: isRunning ? "rgba(84,131,179,0.3)" : "linear-gradient(135deg, #5483B3, #7DA0CA)",
              border: "none",
              color: "#021024",
              cursor: isRunning ? "not-allowed" : "pointer",
              boxShadow: isRunning ? "none" : "0 4px 20px rgba(84,131,179,0.5)",
              fontWeight: "700",
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

        {/* Sliders */}
        <div className="flex gap-8 flex-wrap items-center">
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "#5483B3" }}>
              ARRAY SIZE — {arraySize}
            </label>
            <input
              type="range" min="10" max="100"
              value={arraySize} onChange={handleSizeChange}
              disabled={isRunning}
              className="w-36 accent-[#7DA0CA]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "#5483B3" }}>
              SPEED — {speed}
            </label>
            <input
              type="range" min="1" max="100"
              value={speed} onChange={e => setSpeed(Number(e.target.value))}
              className="w-36 accent-[#7DA0CA]"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap">
          {[
            { color: "#5483B3", label: "Default" },
            { color: "#C1E8FF", label: "Comparing" },
            { color: "#FF6B6B", label: "Swapping" },
            { color: "#7DA0CA", label: "Sorted" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
              <span className="text-xs" style={{ color: "#7DA0CA" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizer */}
      <div
        className="w-full max-w-6xl rounded-2xl p-6"
        style={{
          background: "rgba(2, 16, 36, 0.7)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(2,16,36,0.8), inset 0 1px 0 rgba(193,232,255,0.05)",
          height: "420px",
        }}
      >
        <div className="flex items-end gap-[2px] h-full w-full">
          {array.map((value, index) => (
            <div key={index} className="flex-1 h-full flex items-end">
              <ArrayBar
                value={value}
                maxValue={maxValue}
                color={barColors[index] || "default"}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs" style={{ color: "#5483B3" }}>
        {array.length} elements · AlgoViz © 2025
      </p>
    </div>
  );
}