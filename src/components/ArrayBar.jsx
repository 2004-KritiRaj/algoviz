export default function ArrayBar({ value, maxValue, color = "default" }) {
  const colorMap = {
    default:   "#5483B3",
    comparing: "#C1E8FF",
    swapping:  "#FF6B6B",
    sorted:    "#7DA0CA",
    pivot:     "#FACC15",
  };

  const glowMap = {
    comparing: "0 0 8px rgba(193,232,255,0.7)",
    swapping:  "0 0 8px rgba(255,107,107,0.8)",
    pivot:     "0 0 10px rgba(250,204,21,0.9)",
  };

  return (
    <div
      style={{
        height: `${(value / maxValue) * 100}%`,
        width: "100%",
        background: colorMap[color] || colorMap.default,
        boxShadow: glowMap[color] || "none",
        borderRadius: "2px 2px 0 0",
        transition: "height 0.08s, background 0.1s",
      }}
    />
  );
}