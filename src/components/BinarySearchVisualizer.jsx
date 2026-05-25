import { useState } from "react";
import { getBinarySearchSteps } from "../algorithms/binarySearch";
import { useStepPlayer } from "../hooks/useStepPlayer";
import { useSound } from "../hooks/useSound";

function generateSortedArray(size = 20) {
  const arr = Array.from({ length: size }, () =>
    Math.floor(Math.random() * 195) + 5
  );
  return [...new Set(arr)].sort((a, b) => a - b).slice(0, size);
}

export default function BinarySearchVisualizer() {
  const [array, setArray]         = useState(() => generateSortedArray(20));
  const [target, setTarget]       = useState(null);
  const [customTarget, setCustomTarget] = useState("");
  const [pointers, setPointers]   = useState({ left: null, right: null, mid: null });
  const [found, setFound]         = useState(null); // index or -1
  const [log, setLog]             = useState([]);
  const [speed, setSpeed]         = useState(50);
  const [isDone, setIsDone]       = useState(false);

  const { isRunning, isPaused, currentStep, totalSteps, play, pause, resume, stop, updateSpeed } = useStepPlayer();
  const { playCompare, playSwap, playDone } = useSound();
  const [soundOn, setSoundOn]     = useState(true);

  const maxValue = Math.max(...array);

  function handleNewArray() {
    stop();
    setArray(generateSortedArray(20));
    setPointers({ left: null, right: null, mid: null });
    setFound(null);
    setLog([]);
    setTarget(null);
    setCustomTarget("");
    setIsDone(false);
  }

  function handlePickTarget(val) {
    if (isRunning) return;
    setTarget(val);
    setCustomTarget(String(val));
  }

  function handleCustomTarget(e) {
    setCustomTarget(e.target.value);
    const val = parseInt(e.target.value);
    if (!isNaN(val)) setTarget(val);
  }

  function handleVisualize() {
    if (target === null) return;
    stop();
    setPointers({ left: null, right: null, mid: null });
    setFound(null);
    setLog([]);
    setIsDone(false);

    const steps = getBinarySearchSteps(array, target);

    play(
      steps,
      speed,
      (step) => {
        setPointers({ left: step.left, right: step.right, mid: step.mid });

        if (step.type === "check") {
          if (soundOn) playCompare(step.array[step.mid], maxValue);
          setLog(prev => [...prev, `Checking mid=${step.mid} (value ${step.array[step.mid]}) — target is ${target}`]);
        } else if (step.type === "goRight") {
          if (soundOn) playSwap(step.array[step.mid], maxValue);
          setLog(prev => [...prev, `${step.array[step.mid]} < ${target} → search RIGHT half`]);
        } else if (step.type === "goLeft") {
          if (soundOn) playSwap(step.array[step.mid], maxValue);
          setLog(prev => [...prev, `${step.array[step.mid]} > ${target} → search LEFT half`]);
        } else if (step.type === "found") {
          if (soundOn) playDone();
          setFound(step.mid);
          setLog(prev => [...prev, `✓ Found ${target} at index ${step.mid}!`]);
        } else if (step.type === "notFound") {
          setFound(-1);
          setLog(prev => [...prev, `✗ ${target} not found in array`]);
        }
      },
      () => setIsDone(true)
    );
  }

  function handlePauseResume() {
    if (isPaused) resume();
    else pause();
  }

  function handleReset() {
    stop();
    setPointers({ left: null, right: null, mid: null });
    setFound(null);
    setLog([]);
    setIsDone(false);
  }

  function getBarColor(index) {
    if (found === index) return "#52B788";
    if (found === -1 && isDone) return "#FF6B6B";
    if (pointers.mid === index) return "#C77DFF";
    if (pointers.left !== null && pointers.right !== null) {
      if (index < pointers.left || index > pointers.right) return "#1E3A5F";
      if (index === pointers.left || index === pointers.right) return "#FFB347";
    }
    return "#5483B3";
  }

  function getBarGlow(index) {
    if (found === index) return "0 0 14px rgba(82,183,136,0.9)";
    if (pointers.mid === index) return "0 0 14px rgba(199,125,255,0.9)";
    if (index === pointers.left || index === pointers.right) return "0 0 10px rgba(255,179,71,0.7)";
    return "none";
  }

  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div
      className="w-full flex flex-col items-center p-4 md:p-6"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Info Card */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 md:p-5 mb-4"
        style={{
          background: "rgba(5,38,89,0.6)",
          border: "1px solid rgba(199,125,255,0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex flex-wrap gap-4 justify-between items-start">
          <div style={{ flex: "1 1 200px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#C77DFF", marginBottom: "4px" }}>
              ALGORITHM
            </p>
            <p style={{ fontSize: "clamp(14px,2vw,18px)", fontWeight: "700", color: "#C1E8FF" }}>
              Binary Search
            </p>
            <p style={{ fontSize: "clamp(10px,1.2vw,12px)", color: "#7DA0CA", marginTop: "4px" }}>
              Finds a target in a sorted array by repeatedly halving the search range.
            </p>
          </div>
          <div style={{ display: "flex", gap: "clamp(10px,2vw,24px)", flexWrap: "wrap", alignItems: "center" }}>
            {[
              { label: "BEST",    value: "O(1)" },
              { label: "AVERAGE", value: "O(log n)" },
              { label: "WORST",   value: "O(log n)" },
              { label: "SPACE",   value: "O(1)" },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "8px", color: "#5483B3", marginBottom: "2px" }}>{label}</p>
                <p style={{ fontSize: "clamp(11px,1.5vw,16px)", fontFamily: "monospace", fontWeight: "700", color: "#C77DFF" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Picker */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 mb-4"
        style={{
          background: "rgba(5,38,89,0.5)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.1em", marginBottom: "10px" }}>
          PICK A TARGET — click a bar or type a value
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="number"
            value={customTarget}
            onChange={handleCustomTarget}
            placeholder="Type target..."
            disabled={isRunning}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "rgba(2,16,36,0.6)",
              border: "1px solid rgba(199,125,255,0.4)",
              color: "#C1E8FF",
              fontSize: "13px",
              width: "140px",
              outline: "none",
              fontFamily: "'Segoe UI', sans-serif",
            }}
          />
          {target !== null && (
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                background: "rgba(199,125,255,0.15)",
                border: "1px solid rgba(199,125,255,0.5)",
                color: "#C77DFF",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              Target: {target}
            </div>
          )}
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
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {/* New Array */}
          <button
            onClick={handleNewArray}
            disabled={isRunning && !isPaused}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "600",
              background: "rgba(193,232,255,0.08)",
              border: "1px solid rgba(193,232,255,0.25)",
              color: "#C1E8FF",
              cursor: isRunning && !isPaused ? "not-allowed" : "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              if (!isRunning) {
                e.currentTarget.style.background = "rgba(193,232,255,0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(193,232,255,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            New Array
          </button>

          {/* Visualize */}
          <button
            onClick={handleVisualize}
            disabled={isRunning || target === null}
            style={{
              padding: "8px 20px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "700",
              background: isRunning || target === null
                ? "rgba(84,131,179,0.3)"
                : "linear-gradient(135deg, #C77DFF, #C1E8FF)",
              border: "none", color: "#021024",
              cursor: isRunning || target === null ? "not-allowed" : "pointer",
              boxShadow: isRunning || target === null ? "none" : "0 4px 20px rgba(199,125,255,0.5)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              if (!isRunning && target !== null) {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(199,125,255,0.7)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = isRunning ? "none" : "0 4px 20px rgba(199,125,255,0.5)";
            }}
          >
            {isRunning ? "Running..." : "▶ Search"}
          </button>

          {/* Pause / Resume */}
          {(isRunning || isPaused) && (
            <button
              onClick={handlePauseResume}
              style={{
                padding: "8px 16px", borderRadius: "10px",
                fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "600",
                background: isPaused
                  ? "rgba(82,183,136,0.15)"
                  : "rgba(255,179,71,0.15)",
                border: isPaused
                  ? "1px solid rgba(82,183,136,0.5)"
                  : "1px solid rgba(255,179,71,0.5)",
                color: isPaused ? "#52B788" : "#FFB347",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "600",
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.3)",
              color: "#FF6B6B", cursor: "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,107,107,0.2)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,107,107,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Reset
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundOn(prev => !prev)}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "600",
              background: soundOn ? "rgba(193,232,255,0.15)" : "rgba(84,131,179,0.1)",
              border: soundOn ? "1px solid rgba(193,232,255,0.4)" : "1px solid rgba(84,131,179,0.3)",
              color: soundOn ? "#C1E8FF" : "#5483B3",
              cursor: "pointer", transition: "all 0.25s",
            }}
          >
            {soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
          </button>
        </div>

        {/* Speed slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.08em" }}>
            SPEED — {speed}
          </label>
          <input
            type="range" min="1" max="100" value={speed}
            onChange={e => { setSpeed(Number(e.target.value)); updateSpeed(Number(e.target.value)); }}
            style={{ accentColor: "#C77DFF", width: "clamp(80px,10vw,130px)" }}
          />
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            { color: "#5483B3", label: "Default" },
            { color: "#FFB347", label: "Left / Right" },
            { color: "#C77DFF", label: "Mid" },
            { color: "#52B788", label: "Found" },
            { color: "#FF6B6B", label: "Not Found" },
            { color: "#1E3A5F", label: "Eliminated" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: "clamp(9px,1vw,11px)", color: "#7DA0CA" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step Counter Progress Bar ── */}
      {totalSteps > 0 && (
        <div className="w-full max-w-screen-xl mb-4">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", color: "#5483B3" }}>
              {isPaused ? "⏸ Paused" : isRunning ? "▶ Running" : isDone ? "✓ Complete" : ""}
            </span>
            <span style={{ fontSize: "10px", color: "#7DA0CA", fontFamily: "monospace" }}>
              Step {currentStep} / {totalSteps}
            </span>
          </div>
          <div
            style={{
              width: "100%", height: "4px",
              background: "rgba(84,131,179,0.2)",
              borderRadius: "4px", overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #C77DFF, #C1E8FF)",
                borderRadius: "4px",
                transition: "width 0.15s ease",
                boxShadow: "0 0 8px rgba(199,125,255,0.6)",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Bar Chart — click bar to set target ── */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 md:p-6 mb-4"
        style={{
          background: "rgba(2,16,36,0.75)",
          border: "1px solid rgba(199,125,255,0.25)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(2,16,36,0.8)",
          height: "clamp(200px,38vh,380px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "100%", width: "100%" }}>
          {array.map((value, index) => (
            <div
              key={index}
              style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", cursor: "pointer" }}
              onClick={() => handlePickTarget(value)}
            >
              {/* Value label on top of bar */}
              <span style={{
                fontSize: "clamp(7px,0.9vw,10px)",
                color: getBarColor(index) === "#5483B3" ? "#5483B3" : getBarColor(index),
                marginBottom: "2px",
                fontFamily: "monospace",
                fontWeight: "600",
                transition: "color 0.3s",
              }}>
                {value}
              </span>
              <div
                style={{
                  width: "100%",
                  height: `${(value / maxValue) * 85}%`,
                  background: getBarColor(index),
                  boxShadow: getBarGlow(index),
                  borderRadius: "3px 3px 0 0",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Step Log ── */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4"
        style={{
          background: "rgba(5,38,89,0.5)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
          maxHeight: "160px",
          overflowY: "auto",
        }}
      >
        <p style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.1em", marginBottom: "8px" }}>
          STEP LOG
        </p>
        {log.length === 0 ? (
          <p style={{ fontSize: "11px", color: "#5483B3" }}>
            Click a bar to pick a target, then hit Search...
          </p>
        ) : (
          log.map((entry, i) => (
            <p
              key={i}
              style={{
                fontSize: "clamp(10px,1.1vw,12px)",
                color: entry.startsWith("✓") ? "#52B788" : entry.startsWith("✗") ? "#FF6B6B" : "#7DA0CA",
                marginBottom: "4px",
                fontFamily: "monospace",
              }}
            >
              {entry}
            </p>
          ))
        )}
      </div>

      <p style={{ marginTop: "12px", fontSize: "10px", color: "#5483B3" }}>
        Binary Search · {array.length} elements (sorted) · AlgoViz © 2026
      </p>
    </div>
  );
}