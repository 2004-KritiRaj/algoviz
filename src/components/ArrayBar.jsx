export default function ArrayBar({ value, maxValue, color = "default" }) {
  const colorMap = {
    default: "bg-cyan-400",
    comparing: "bg-yellow-400",
    swapping: "bg-red-500",
    sorted: "bg-green-500",
  };

  const heightPercent = (value / maxValue) * 100;

  return (
    <div
      className={`${colorMap[color]} rounded-t-sm transition-all duration-100`}
      style={{
        height: `${heightPercent}%`,
        width: "100%",
      }}
    />
  );
}