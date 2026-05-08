import { useState } from "react";
import ArrayBar from "./ArrayBar";
import { generateRandomArray } from "../utils/arrayUtils";

export default function Visualizer() {
  const [array, setArray] = useState(() => generateRandomArray(50));
  const [arraySize, setArraySize] = useState(50);

  const maxValue = Math.max(...array);

  function handleNewArray() {
    setArray(generateRandomArray(arraySize));
  }

  function handleSizeChange(e) {
    const newSize = Number(e.target.value);
    setArraySize(newSize);
    setArray(generateRandomArray(newSize));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-cyan-400 mb-8 tracking-widest">
        AlgoViz
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 items-center justify-center mb-8">
        
        <button
          onClick={handleNewArray}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold px-6 py-2 rounded-lg transition-colors"
        >
          Generate New Array
        </button>

        <div className="flex flex-col items-center gap-1">
          <label className="text-sm text-gray-400">
            Array Size: {arraySize}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={handleSizeChange}
            className="w-40 accent-cyan-400"
          />
        </div>

      </div>

      {/* Bar Chart */}
      <div
        className="w-full max-w-5xl bg-gray-800 rounded-xl p-4"
        style={{ height: "400px" }}
      >
        <div className="flex items-end gap-[2px] h-full w-full">
          {array.map((value, index) => (
            <div key={index} className="flex-1 h-full flex items-end">
              <ArrayBar value={value} maxValue={maxValue} color="default" />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <p className="mt-4 text-gray-500 text-sm">
        {array.length} elements · Max value: {maxValue}
      </p>

    </div>
  );
}