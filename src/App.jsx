import { useState } from "react";
import Visualizer from "./components/Visualizer";
import GraphVisualizer from "./components/GraphVisualizer";

export default function App() {
  const [tab, setTab] = useState("sorting");
  const [transitioning, setTransitioning] = useState(false);

  function switchTab(newTab) {
    if (newTab === tab) return;
    setTransitioning(true);
    setTimeout(() => {
      setTab(newTab);
      setTransitioning(false);
    }, 200);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #021024 0%, #052659 60%, #5483B3 100%)" }}>

      {/* ── Fixed Navbar ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(2, 16, 36, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(84,131,179,0.25)",
          boxShadow: "0 4px 24px rgba(2,16,36,0.6)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 20px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {/* Logo icon */}
            <div
              style={{
                width: "36px", height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #5483B3, #C1E8FF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(193,232,255,0.3)",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="10" width="3" height="8" rx="1" fill="#021024"/>
                <rect x="7" y="6" width="3" height="12" rx="1" fill="#021024"/>
                <rect x="12" y="3" width="3" height="15" rx="1" fill="#021024"/>
                <rect x="17" y="8" width="3" height="10" rx="1" fill="#021024" opacity="0.7"/>
              </svg>
            </div>
            <span
              style={{
                fontSize: "clamp(16px,2vw,22px)",
                fontWeight: "800",
                letterSpacing: "0.15em",
                color: "#C1E8FF",
                textShadow: "0 0 20px rgba(193,232,255,0.3)",
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              ALGO<span style={{ color: "#7DA0CA" }}>VIZ</span>
            </span>
          </div>

          {/* Tab Switcher — center */}
          <div
            style={{
              display: "flex",
              background: "rgba(5,38,89,0.6)",
              borderRadius: "12px",
              padding: "4px",
              border: "1px solid rgba(84,131,179,0.3)",
              gap: "4px",
            }}
          >
            {[
              { key: "sorting", icon: "📊", label: "Sorting" },
              { key: "graph",   icon: "🔗", label: "Graph" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "9px",
                  fontSize: "clamp(10px,1.2vw,13px)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: tab === key
                    ? "linear-gradient(135deg, #5483B3, #7DA0CA)"
                    : "transparent",
                  border: "none",
                  color: tab === key ? "#021024" : "#5483B3",
                  boxShadow: tab === key ? "0 2px 12px rgba(84,131,179,0.5)" : "none",
                  transform: tab === key ? "scale(1.02)" : "scale(1)",
                  fontFamily: "'Segoe UI', sans-serif",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Right side — GitHub link */}
          
            href="https://github.com/YOUR_USERNAME/algoviz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 14px",
              borderRadius: "10px",
              background: "rgba(193,232,255,0.08)",
              border: "1px solid rgba(193,232,255,0.2)",
              color: "#C1E8FF",
              textDecoration: "none",
              fontSize: "clamp(10px,1.1vw,12px)",
              fontWeight: "600",
              transition: "all 0.25s ease",
              flexShrink: 0,
              fontFamily: "'Segoe UI', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(193,232,255,0.15)";
              e.currentTarget.style.borderColor = "rgba(193,232,255,0.4)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(193,232,255,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(193,232,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(193,232,255,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* GitHub SVG icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C1E8FF">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="github-label">GitHub</span>
          </a>
        </div>
      </nav>

      {/* ── Page Content with fade transition ── */}
      <div
        style={{
          paddingTop: "64px",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {tab === "sorting" ? <Visualizer /> : <GraphVisualizer />}
      </div>
    </div>
  );
}