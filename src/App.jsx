import Visualizer from "./components/Visualizer";
import { useState } from "react";
import GraphVisualizer from "./components/GraphVisualizer";


export default function App() {
  const [tab, setTab] = useState("sorting");
  return (
    <div>
      {/* Global Tab Bar */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(2,16,36,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(84,131,179,0.3)",
          display: "flex", justifyContent: "center", gap: "8px",
          padding: "10px 16px",
        }}
      >
        {[
          { key: "sorting", label: "📊 Sorting Algorithms" },
          { key: "graph",   label: "🔗 Graph Traversal" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "8px 20px",
              borderRadius: "10px",
              fontSize: "clamp(10px,1.3vw,13px)",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
              background: tab === key
                ? "linear-gradient(135deg, #5483B3, #7DA0CA)"
                : "rgba(5,38,89,0.6)",
              border: tab === key
                ? "none"
                : "1px solid rgba(84,131,179,0.3)",
              color: tab === key ? "#021024" : "#5483B3",
              boxShadow: tab === key ? "0 4px 16px rgba(84,131,179,0.4)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Page content pushed below fixed tab bar */}
      <div style={{ paddingTop: "60px" }}>
        {tab === "sorting" ? <Visualizer /> : <GraphVisualizer />}
      </div>
    </div>
  );
}