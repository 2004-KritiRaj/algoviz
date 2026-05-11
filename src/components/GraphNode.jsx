export default function GraphNode({ id, x, y, state, onClick, isStart }) {
  const stateStyles = {
    unvisited: {
      fill: "#052659",
      stroke: "#5483B3",
      color: "#7DA0CA",
      shadow: "none",
    },
    inQueue: {
      fill: "#7C3D00",
      stroke: "#FFB347",
      color: "#FFB347",
      shadow: "0 0 12px rgba(255,179,71,0.8)",
    },
    visited: {
      fill: "#1A4731",
      stroke: "#52B788",
      color: "#52B788",
      shadow: "0 0 12px rgba(82,183,136,0.7)",
    },
    start: {
      fill: "#3B0764",
      stroke: "#C77DFF",
      color: "#C77DFF",
      shadow: "0 0 16px rgba(199,125,255,0.9)",
    },
  };

  const style = isStart
    ? stateStyles.start
    : stateStyles[state] || stateStyles.unvisited;

  return (
    <g
      onClick={() => onClick(id)}
      style={{ cursor: "pointer" }}
    >
      {/* Glow ring */}
      {(state !== "unvisited" || isStart) && (
        <circle
          cx={x} cy={y} r={30}
          fill="none"
          stroke={style.stroke}
          strokeWidth="1"
          opacity="0.3"
        />
      )}

      {/* Main circle */}
      <circle
        cx={x} cy={y} r={22}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth="2"
        style={{
          filter: state !== "unvisited" || isStart
            ? `drop-shadow(0 0 8px ${style.stroke})`
            : "none",
          transition: "all 0.3s ease",
        }}
      />

      {/* Node label */}
      <text
        x={x} y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        fontFamily="'Segoe UI', sans-serif"
        fill={style.color}
        style={{ transition: "fill 0.3s" }}
      >
        {id}
      </text>
    </g>
  );
}