export default function ArrayBar({ value, maxValue, color = "default", width }) {
  const colors = {
    default:   "bg-[#5483B3]",
    comparing: "bg-[#C1E8FF]",
    swapping:  "bg-[#FF6B6B]",
    sorted:    "bg-[#7DA0CA]",
    pivot:     "bg-yellow-400",
  };

  const heightPercent = (value / maxValue) * 100;

  return (
    <div
      className={`${colors[color]} rounded-t-[3px] transition-all duration-75`}
      style={{
        height: `${heightPercent}%`,
        width: "100%",
        boxShadow: color === "comparing"
          ? "0 0 8px rgba(193,232,255,0.7)"
          : color === "swapping"
          ? "0 0 8px rgba(255,107,107,0.7)"
          : "none",
      }}
    />
  );
}