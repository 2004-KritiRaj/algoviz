import { useState, useRef } from "react";
import GraphNode from "./GraphNode";
import { graphNodes, graphEdges, adjacencyList } from "../data/graphData";
import { getBFSSteps } from "../algorithms/bfs";
import { getDFSSteps } from "../algorithms/dfs";
import { useSound } from "../hooks/useSound";

const MODE_INFO = {
  bfs: {
    name: "Breadth-First Search",
    color: "#FFB347",
    accent: "#FF9F43",
    structure: "Queue",
    desc: "Explores all neighbours first before going deeper. Uses a Queue (FIFO).",
    best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)",
  },
  dfs: {
    name: "Depth-First Search",
    color: "#C77DFF",
    accent: "#9D4EDD",
    structure: "Stack",
    desc: "Explores as deep as possible before backtracking. Uses a Stack (LIFO).",
    best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)", space: "O(V)",
  },
};

export default function GraphVisualizer() {
  const [mode, setMode]             = useState("bfs");
  const [startNode, setStartNode]   = useState(0);
  const [nodeStates, setNodeStates] = useState({});
  const [isRunning, setIsRunning]   = useState(false);
  const [speed, setSpeed]           = useState(60);
  const [queueStack, setQueueStack] = useState([]);
  const [visitedOrder, setVisitedOrder] = useState([]);
  const [isDone, setIsDone]         = useState(false);
  const timeoutsRef                 = useRef([]);
  const info                        = MODE_INFO[mode];

  const { playNodeVisit, playNodeEnqueue, playGraphDone } = useSound();
  const [soundOn, setSoundOn] = useState(true);

  function handleNodeClick(id) {
    if (isRunning) return;
    setStartNode(id);
    setNodeStates({});
    setQueueStack([]);
    setVisitedOrder([]);
    setIsDone(false);
  }

  function handleModeSwitch(newMode) {
    if (isRunning) return;
    setMode(newMode);
    setNodeStates({});
    setQueueStack([]);
    setVisitedOrder([]);
    setIsDone(false);
  }

  function handleReset() {
    timeoutsRef.current.forEach(clearTimeout);
    setNodeStates({});
    setQueueStack([]);
    setVisitedOrder([]);
    setIsRunning(false);
    setIsDone(false);
  }

  function handleVisualize() {
    if (isRunning) return;
    setNodeStates({});
    setQueueStack([]);
    setVisitedOrder([]);
    setIsDone(false);
    setIsRunning(true);

    const steps = mode === "bfs"
      ? getBFSSteps(startNode, adjacencyList)
      : getDFSSteps(startNode, adjacencyList);

    const delay = 1100 - (speed * 10);

    steps.forEach((step, i) => {
      const t = setTimeout(() => {
        if (step.type === "enqueue" || step.type === "push") {
            if (soundOn) playNodeEnqueue(step.node);   
            setNodeStates(prev => ({ ...prev, [step.node]: "inQueue" }));
            setQueueStack(mode === "bfs" ? [...step.queue] : [...step.stack]);
        } else if (step.type === "visit") {
            if (soundOn) playNodeVisit(step.node);
            setNodeStates(prev => ({ ...prev, [step.node]: "visited" }));
            setQueueStack(mode === "bfs" ? [...step.queue] : [...step.stack]);
            setVisitedOrder([...step.visited]);
        } else if (step.type === "done") {
            if (soundOn) playGraphDone(); 
            setIsRunning(false);
            setIsDone(true);
            setQueueStack([]);
        }
      }, i * delay);
      timeoutsRef.current.push(t);
    });
  }

  // SVG dimensions
  const svgW = 600, svgH = 560;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 md:p-6"
      style={{
        background: "linear-gradient(135deg, #021024 0%, #052659 60%, #5483B3 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Navbar */}
      {/* <div className="w-full max-w-screen-xl flex items-center mb-6">
        <h1
          style={{
            fontSize: "clamp(20px,3vw,32px)",
            fontWeight: "700",
            letterSpacing: "0.2em",
            color: "#C1E8FF",
            textShadow: "0 0 30px rgba(193,232,255,0.4)",
          }}
        >
          ALGO<span style={{ color: "#7DA0CA" }}>VIZ</span>
        </h1>
      </div> */}

      {/* BFS / DFS Toggle */}
      <div className="w-full max-w-screen-xl flex gap-3 mb-5 flex-wrap">
        {["bfs", "dfs"].map(m => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            disabled={isRunning}
            style={{
              flex: "1 1 140px",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "clamp(11px,1.5vw,14px)",
              fontWeight: "600",
              cursor: isRunning ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              background: mode === m
                ? `linear-gradient(135deg, ${MODE_INFO[m].color}33, ${MODE_INFO[m].color}55)`
                : "rgba(5,38,89,0.5)",
              border: mode === m
                ? `1.5px solid ${MODE_INFO[m].color}`
                : "1px solid rgba(84,131,179,0.3)",
              color: mode === m ? MODE_INFO[m].color : "#5483B3",
              boxShadow: mode === m ? `0 4px 20px ${MODE_INFO[m].color}33` : "none",
              transform: mode === m ? "translateY(-2px)" : "none",
            }}
            onMouseEnter={e => {
              if (!isRunning && mode !== m) {
                e.currentTarget.style.background = `${MODE_INFO[m].color}22`;
                e.currentTarget.style.borderColor = `${MODE_INFO[m].color}88`;
                e.currentTarget.style.color = MODE_INFO[m].color;
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={e => {
              if (mode !== m) {
                e.currentTarget.style.background = "rgba(5,38,89,0.5)";
                e.currentTarget.style.borderColor = "rgba(84,131,179,0.3)";
                e.currentTarget.style.color = "#5483B3";
                e.currentTarget.style.transform = "none";
              }
            }}
          >
            {MODE_INFO[m].name}
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
          boxShadow: "0 8px 32px rgba(2,16,36,0.5)",
          transition: "all 0.4s",
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
            <p style={{ fontSize: "clamp(10px,1.2vw,12px)", color: "#7DA0CA", marginTop: "4px" }}>
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
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleVisualize}
            disabled={isRunning}
            style={{
              padding: "8px 20px", borderRadius: "10px",
              fontSize: "clamp(10px,1.2vw,13px)", fontWeight: "700",
              background: isRunning
                ? "rgba(84,131,179,0.3)"
                : `linear-gradient(135deg, ${info.color}, #C1E8FF)`,
              border: "none", color: "#021024",
              cursor: isRunning ? "not-allowed" : "pointer",
              boxShadow: isRunning ? "none" : `0 4px 20px ${info.color}66`,
              transition: "all 0.3s",
            }}
            onMouseEnter={e => {
            if (!isRunning) {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 8px 28px ${info.color}88`;
            }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = isRunning ? "none" : `0 4px 20px ${info.color}66`;
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
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,107,107,0.2)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,107,107,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,107,107,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Reset
        </button>
        <button
            onClick={() => setSoundOn(prev => !prev)}
            style={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "clamp(10px,1.2vw,13px)",
                fontWeight: "600",
                background: soundOn
                  ? "rgba(193,232,255,0.15)"
                  : "rgba(84,131,179,0.1)",
                border: soundOn
                  ? "1px solid rgba(193,232,255,0.4)"
                  : "1px solid rgba(84,131,179,0.3)",
                color: soundOn ? "#C1E8FF" : "#5483B3",
                cursor: "pointer",
                transition: "all 0.3s",
            }}
        >
            {soundOn ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.08em" }}>
            SPEED — {speed}
          </label>
          <input type="range" min="1" max="100" value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ accentColor: info.color, width: "clamp(80px,10vw,130px)" }} />
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { color: "#5483B3",  label: "Unvisited" },
            { color: "#C77DFF",  label: "Start Node" },
            { color: "#FFB347",  label: mode === "bfs" ? "In Queue" : "In Stack" },
            { color: "#52B788",  label: "Visited" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: "clamp(9px,1vw,11px)", color: "#7DA0CA" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content — Graph + Side Panel */}
      <div
        className="w-full max-w-screen-xl flex flex-wrap gap-4"
        style={{ flex: 1 }}
      >
        {/* SVG Graph */}
        <div
          style={{
            flex: "2 1 320px",
            background: "rgba(2,16,36,0.75)",
            border: `1px solid ${info.color}33`,
            borderRadius: "16px",
            padding: "16px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(2,16,36,0.8)",
            transition: "border-color 0.4s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "10px", color: "#5483B3", marginBottom: "8px", letterSpacing: "0.1em" }}>
            CLICK A NODE TO SET START POINT
          </p>
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            style={{ width: "100%", maxWidth: "600px", height: "auto" }}
          >
            {/* Edges */}
            {graphEdges.map(([a, b], i) => {
              const na = graphNodes[a], nb = graphNodes[b];
              const bothVisited =
                nodeStates[a] === "visited" && nodeStates[b] === "visited";
              return (
                <line
                  key={i}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={bothVisited ? info.color : "#1E3A5F"}
                  strokeWidth={bothVisited ? "2.5" : "1.5"}
                  strokeOpacity={bothVisited ? "0.7" : "0.5"}
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />
              );
            })}

            {/* Nodes */}
            {Object.entries(graphNodes).map(([id, pos]) => (
              <GraphNode
                key={id}
                id={Number(id)}
                x={pos.x}
                y={pos.y}
                state={nodeStates[Number(id)] || "unvisited"}
                isStart={Number(id) === startNode}
                onClick={handleNodeClick}
              />
            ))}
          </svg>
        </div>

        {/* Side Panel */}
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Queue / Stack display */}
          <div
            style={{
              background: "rgba(5,38,89,0.6)",
              border: `1px solid ${info.color}44`,
              borderRadius: "14px",
              padding: "16px",
              backdropFilter: "blur(10px)",
              transition: "border-color 0.4s",
            }}
          >
            <p style={{ fontSize: "9px", color: info.color, letterSpacing: "0.1em", marginBottom: "10px" }}>
              {mode === "bfs" ? "QUEUE (FIFO)" : "STACK (LIFO)"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "36px" }}>
              {queueStack.length === 0 ? (
                <span style={{ fontSize: "11px", color: "#5483B3" }}>
                  {isDone ? "Empty — traversal complete!" : "Waiting to start..."}
                </span>
              ) : (
                queueStack.map((node, i) => (
                  <div
                    key={i}
                    style={{
                      width: "32px", height: "32px",
                      borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${info.color}22`,
                      border: `1px solid ${info.color}66`,
                      color: info.color,
                      fontSize: "13px", fontWeight: "700",
                      boxShadow: `0 0 8px ${info.color}44`,
                    }}
                  >
                    {node}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Visited Order */}
          <div
            style={{
              background: "rgba(5,38,89,0.6)",
              border: "1px solid rgba(82,183,136,0.4)",
              borderRadius: "14px",
              padding: "16px",
              backdropFilter: "blur(10px)",
              flex: 1,
            }}
          >
            <p style={{ fontSize: "9px", color: "#52B788", letterSpacing: "0.1em", marginBottom: "10px" }}>
              VISITED ORDER
            </p>
            {visitedOrder.length === 0 ? (
              <span style={{ fontSize: "11px", color: "#5483B3" }}>No nodes visited yet...</span>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
                {visitedOrder.map((node, i) => (
                  <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <div
                      style={{
                        width: "28px", height: "28px",
                        borderRadius: "6px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(82,183,136,0.15)",
                        border: "1px solid rgba(82,183,136,0.5)",
                        color: "#52B788",
                        fontSize: "12px", fontWeight: "700",
                      }}
                    >
                      {node}
                    </div>
                    {i < visitedOrder.length - 1 && (
                      <span style={{ color: "#5483B3", fontSize: "10px" }}>→</span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {isDone && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "10px",
                  borderRadius: "10px",
                  background: "rgba(82,183,136,0.1)",
                  border: "1px solid rgba(82,183,136,0.3)",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#52B788", fontSize: "12px", fontWeight: "700" }}>
                  ✓ Traversal Complete!
                </p>
                <p style={{ color: "#7DA0CA", fontSize: "10px", marginTop: "4px" }}>
                  {visitedOrder.length} nodes visited
                </p>
              </div>
            )}
          </div>

          {/* Start node info */}
          <div
            style={{
              background: "rgba(5,38,89,0.6)",
              border: "1px solid rgba(199,125,255,0.4)",
              borderRadius: "14px",
              padding: "14px",
              backdropFilter: "blur(10px)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "9px", color: "#C77DFF", letterSpacing: "0.1em", marginBottom: "6px" }}>
              START NODE
            </p>
            <div
              style={{
                width: "44px", height: "44px",
                borderRadius: "50%",
                background: "rgba(199,125,255,0.15)",
                border: "2px solid #C77DFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
                fontSize: "18px", fontWeight: "700", color: "#C77DFF",
                boxShadow: "0 0 16px rgba(199,125,255,0.5)",
              }}
            >
              {startNode}
            </div>
            <p style={{ fontSize: "9px", color: "#5483B3", marginTop: "8px" }}>
              Click any node to change
            </p>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "12px", fontSize: "10px", color: "#5483B3" }}>
        {info.name} · V = 8 nodes · E = 9 edges · AlgoViz © 2026
      </p>
    </div>
  );
}