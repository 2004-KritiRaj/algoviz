import { useState, useRef, useEffect } from "react";
import { generateRandomArray } from "../utils/arrayUtils";
import { getBubbleSortSteps } from "../algorithms/bubbleSort";
import { getInsertionSortSteps } from "../algorithms/insertionSort";
import { getSelectionSortSteps } from "../algorithms/selectionSort";
import { getMergeSortSteps } from "../algorithms/mergeSort";
import { getQuickSortSteps } from "../algorithms/quickSort";

const ALGOS = {
  bubble:    { name: "Bubble Sort",    fn: getBubbleSortSteps,    color: "#7DA0CA" },
  insertion: { name: "Insertion Sort", fn: getInsertionSortSteps, color: "#52B788" },
  selection: { name: "Selection Sort", fn: getSelectionSortSteps, color: "#FFB347" },
  merge:     { name: "Merge Sort",     fn: getMergeSortSteps,     color: "#C77DFF" },
  quick:     { name: "Quick Sort",     fn: getQuickSortSteps,     color: "#FF9F43" },
};

const ALGO_KEYS = Object.keys(ALGOS);

const ALGO_COLORS = {
  bubble:    { default: "#5483B3", comparing: "#C1E8FF", swapping: "#FF6B6B", sorted: "#7DA0CA", pivot: "#FACC15" },
  insertion: { default: "#3A7D44", comparing: "#A8D8A8", swapping: "#FF6B6B", sorted: "#52B788", pivot: "#FACC15" },
  selection: { default: "#A0522D", comparing: "#FFD9A0", swapping: "#FF6B6B", sorted: "#FFB347", pivot: "#FACC15" },
  merge:     { default: "#6A0DAD", comparing: "#C77DFF", swapping: "#E0AAFF", sorted: "#9D4EDD", pivot: "#FACC15" },
  quick:     { default: "#B5451B", comparing: "#FFD9A0", swapping: "#FF6B6B", sorted: "#FF9F43", pivot: "#FACC15" },
};

const TIPS = {
  bubble:    "Bubble Sort compares and swaps adjacent neighbours repeatedly.",
  insertion: "Insertion Sort builds the sorted array one element at a time from left.",
  selection: "Selection Sort finds the minimum each pass and places it at the front.",
  merge:     "Merge Sort splits the array in half recursively then merges back.",
  quick:     "Quick Sort picks a pivot and partitions elements around it.",
};

const TOTAL_QUESTIONS = 5;
const QUESTION_TIME   = 30;

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getOptions(correct) {
  const wrong = ALGO_KEYS.filter(k => k !== correct);
  const picked = shuffleArray(wrong).slice(0, 3);
  return shuffleArray([correct, ...picked]);
}

export default function QuizMode() {
  const [phase, setPhase]             = useState("intro");   // intro | question | result | done
  const [score, setScore]             = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [currentAlgo, setCurrentAlgo] = useState(null);
  const [options, setOptions]         = useState([]);
  const [array, setArray]             = useState([]);
  const [barColors, setBarColors]     = useState({});
  const [answered, setAnswered]       = useState(null);      // null | "correct" | "wrong"
  const [selectedOption, setSelected] = useState(null);
  const [timeLeft, setTimeLeft]       = useState(QUESTION_TIME);
  const [history, setHistory]         = useState([]);        // [{algo, selected, correct}]
  const [isAnimating, setIsAnimating] = useState(false);

  const timeoutsRef  = useRef([]);
  const timerRef     = useRef(null);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      clearInterval(timerRef.current);
    };
  }, []);

  function clearAll() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    clearInterval(timerRef.current);
  }

  function startQuestion(qNum) {
    clearAll();
    const algo = ALGO_KEYS[Math.floor(Math.random() * ALGO_KEYS.length)];
    const arr  = generateRandomArray(40);
    const opts = getOptions(algo);

    setCurrentAlgo(algo);
    setOptions(opts);
    setArray(arr);
    setBarColors({});
    setAnswered(null);
    setSelected(null);
    setTimeLeft(QUESTION_TIME);
    setQuestionNum(qNum);
    setPhase("question");
    setIsAnimating(true);

    // start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp(algo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // run animation
    runAnimation(algo, arr);
  }

  function runAnimation(algo, arr) {
    const steps   = ALGOS[algo].fn(arr);
    const palette = ALGO_COLORS[algo];
    const delay   = 80;

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
        } else if (step.type === "overwrite") {
          setArray([...step.array]);
          setBarColors(prev => ({ ...prev, [step.index]: "swapping" }));
        } else if (step.type === "pivot") {
          setBarColors(prev => ({ ...prev, [step.index]: "pivot" }));
        } else if (step.type === "sorted") {
          setBarColors(prev => ({ ...prev, [step.index]: "sorted" }));
        } else if (step.type === "done") {
          setArray([...step.array]);
          setBarColors({});
          setIsAnimating(false);
        }
      }, i * delay);
      timeoutsRef.current.push(t);
    });
  }

  function handleTimeUp(algo) {
    clearAll();
    setAnswered("wrong");
    setIsAnimating(false);
    setHistory(prev => [...prev, { algo, selected: "timeout", correct: false }]);
    setTimeout(() => nextQuestion(), 2500);
  }

  function handleAnswer(selected) {
    if (answered !== null) return;
    clearAll();
    setIsAnimating(false);
    setSelected(selected);

    const isCorrect = selected === currentAlgo;
    setAnswered(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 1);
    setHistory(prev => [...prev, { algo: currentAlgo, selected, correct: isCorrect }]);

    setTimeout(() => nextQuestion(), 2500);
  }

  function nextQuestion() {
    if (questionNum >= TOTAL_QUESTIONS) {
      setPhase("done");
    } else {
      startQuestion(questionNum + 1);
    }
  }

  function handleStart() {
    setScore(0);
    setHistory([]);
    startQuestion(1);
  }

  function handleRestart() {
    clearAll();
    setScore(0);
    setHistory([]);
    setBarColors({});
    setPhase("intro");
  }

  const maxValue = array.length > 0 ? Math.max(...array) : 100;
  const palette  = currentAlgo ? ALGO_COLORS[currentAlgo] : ALGO_COLORS.bubble;

  // ── INTRO SCREEN ──
  if (phase === "intro") {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6"
        style={{ fontFamily: "'Segoe UI', sans-serif" }}
      >
        <div
          style={{
            maxWidth: "520px", width: "100%", textAlign: "center",
            background: "rgba(5,38,89,0.6)",
            border: "1px solid rgba(84,131,179,0.4)",
            borderRadius: "24px", padding: "48px 32px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(2,16,36,0.6)",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🧠</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: "800", color: "#C1E8FF", marginBottom: "12px" }}>
            Algorithm Quiz
          </h1>
          <p style={{ color: "#7DA0CA", fontSize: "clamp(12px,1.4vw,15px)", marginBottom: "32px", lineHeight: "1.6" }}>
            Watch the animation and guess which sorting algorithm is running.
            You have <span style={{ color: "#FFB347", fontWeight: "700" }}>{QUESTION_TIME} seconds</span> per
            question and <span style={{ color: "#C77DFF", fontWeight: "700" }}>{TOTAL_QUESTIONS} questions</span> total.
          </p>

          {/* Algorithm hints */}
          <div style={{ textAlign: "left", marginBottom: "32px" }}>
            {ALGO_KEYS.map(key => (
              <div
                key={key}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: ALGOS[key].color, flexShrink: 0, marginTop: "4px",
                  }}
                />
                <div>
                  <span style={{ color: ALGOS[key].color, fontWeight: "700", fontSize: "13px" }}>
                    {ALGOS[key].name}
                  </span>
                  <span style={{ color: "#5483B3", fontSize: "12px" }}>
                    {" "}— {TIPS[key]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            style={{
              width: "100%", padding: "14px",
              borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, #5483B3, #C1E8FF)",
              color: "#021024", fontSize: "16px", fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(84,131,179,0.5)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(84,131,179,0.7)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(84,131,179,0.5)";
            }}
          >
            Start Quiz 🚀
          </button>
        </div>
      </div>
    );
  }

  // ── DONE SCREEN ──
  if (phase === "done") {
    const weakAlgos = history
      .filter(h => !h.correct)
      .map(h => ALGOS[h.algo].name);
    const uniqueWeak = [...new Set(weakAlgos)];

    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center p-6"
        style={{ fontFamily: "'Segoe UI', sans-serif" }}
      >
        <div
          style={{
            maxWidth: "560px", width: "100%",
            background: "rgba(5,38,89,0.6)",
            border: "1px solid rgba(84,131,179,0.4)",
            borderRadius: "24px", padding: "40px 32px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(2,16,36,0.6)",
          }}
        >
          {/* Score */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "56px", marginBottom: "8px" }}>
              {score >= 4 ? "🏆" : score >= 2 ? "👍" : "📚"}
            </div>
            <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: "800", color: "#C1E8FF", marginBottom: "8px" }}>
              You scored {score}/{TOTAL_QUESTIONS}
            </h2>
            <p style={{ color: "#7DA0CA", fontSize: "13px" }}>
              {score === 5 ? "Perfect! You know your algorithms! 🎉"
               : score >= 3 ? "Good job! Keep practising the tricky ones."
               : "Keep studying — you'll get there!"}
            </p>
          </div>

          {/* Per question breakdown */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.1em", marginBottom: "12px" }}>
              QUESTION BREAKDOWN
            </p>
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 14px",
                  borderRadius: "10px", marginBottom: "6px",
                  background: h.correct
                    ? "rgba(82,183,136,0.1)"
                    : "rgba(255,107,107,0.1)",
                  border: h.correct
                    ? "1px solid rgba(82,183,136,0.3)"
                    : "1px solid rgba(255,107,107,0.3)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "14px" }}>{h.correct ? "✓" : "✗"}</span>
                  <div>
                    <p style={{ color: "#C1E8FF", fontSize: "12px", fontWeight: "600" }}>
                      Q{i + 1}: {ALGOS[h.algo].name}
                    </p>
                    {!h.correct && h.selected !== "timeout" && (
                      <p style={{ color: "#5483B3", fontSize: "10px" }}>
                        You said: {ALGOS[h.selected]?.name || "—"}
                      </p>
                    )}
                    {h.selected === "timeout" && (
                      <p style={{ color: "#5483B3", fontSize: "10px" }}>Time ran out</p>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px", fontWeight: "700",
                    color: h.correct ? "#52B788" : "#FF6B6B",
                  }}
                >
                  {h.correct ? "+1" : "0"}
                </span>
              </div>
            ))}
          </div>

          {/* Weak spots */}
          {uniqueWeak.length > 0 && (
            <div
              style={{
                padding: "14px", borderRadius: "12px", marginBottom: "24px",
                background: "rgba(255,179,71,0.08)",
                border: "1px solid rgba(255,179,71,0.3)",
              }}
            >
              <p style={{ fontSize: "9px", color: "#FFB347", letterSpacing: "0.1em", marginBottom: "8px" }}>
                NEEDS PRACTICE
              </p>
              {uniqueWeak.map(name => {
                const key = ALGO_KEYS.find(k => ALGOS[k].name === name);
                return (
                  <p key={name} style={{ color: "#7DA0CA", fontSize: "12px", marginBottom: "4px" }}>
                    • <span style={{ color: ALGOS[key].color, fontWeight: "600" }}>{name}</span>
                    {" "}— {TIPS[key]}
                  </p>
                );
              })}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleRestart}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #5483B3, #C1E8FF)",
                color: "#021024", fontSize: "14px", fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(84,131,179,0.4)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Try Again 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREEN ──
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center p-4 md:p-6"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* Header row */}
      <div
        className="w-full max-w-screen-xl flex flex-wrap gap-3 items-center justify-between mb-4"
      >
        {/* Question progress */}
        <div style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "32px", height: "6px", borderRadius: "3px",
                background: i < questionNum - 1
                  ? (history[i]?.correct ? "#52B788" : "#FF6B6B")
                  : i === questionNum - 1
                  ? "#C1E8FF"
                  : "rgba(84,131,179,0.3)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Score */}
        <div
          style={{
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(5,38,89,0.6)",
            border: "1px solid rgba(84,131,179,0.3)",
            color: "#C1E8FF", fontSize: "13px", fontWeight: "700",
          }}
        >
          Score: {score}/{questionNum - 1}
        </div>

        {/* Timer */}
        <div
          style={{
            padding: "6px 16px", borderRadius: "20px",
            background: timeLeft <= 10
              ? "rgba(255,107,107,0.15)"
              : "rgba(5,38,89,0.6)",
            border: timeLeft <= 10
              ? "1px solid rgba(255,107,107,0.4)"
              : "1px solid rgba(84,131,179,0.3)",
            color: timeLeft <= 10 ? "#FF6B6B" : "#FFB347",
            fontSize: "13px", fontWeight: "700",
            transition: "all 0.3s",
          }}
        >
          ⏱ {timeLeft}s
        </div>
      </div>

      {/* Mystery info card */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 mb-4"
        style={{
          background: "rgba(5,38,89,0.6)",
          border: "1px solid rgba(84,131,179,0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <p style={{ fontSize: "9px", color: "#5483B3", letterSpacing: "0.1em", marginBottom: "4px" }}>
              QUESTION {questionNum} OF {TOTAL_QUESTIONS}
            </p>
            <p style={{ fontSize: "clamp(14px,2vw,20px)", fontWeight: "800", color: "#C1E8FF" }}>
              Which algorithm is this? 🤔
            </p>
            <p style={{ fontSize: "12px", color: "#5483B3", marginTop: "4px" }}>
              Watch the animation carefully — the color pattern gives it away
            </p>
          </div>
          <div
            style={{
              padding: "8px 20px", borderRadius: "10px",
              background: "rgba(84,131,179,0.1)",
              border: "1px solid rgba(84,131,179,0.3)",
              color: "#5483B3", fontSize: "clamp(18px,3vw,28px)",
              fontWeight: "800", letterSpacing: "0.1em",
            }}
          >
            ???
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div
        className="w-full max-w-screen-xl rounded-2xl p-4 mb-4"
        style={{
          background: "rgba(2,16,36,0.75)",
          border: "1px solid rgba(84,131,179,0.25)",
          backdropFilter: "blur(10px)",
          height: "clamp(180px,32vh,340px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "100%", width: "100%" }}>
          {array.map((value, index) => {
            const colorKey = barColors[index] || "default";
            const barColor = palette[colorKey];
            const glow =
              colorKey === "comparing" ? `0 0 8px ${palette.comparing}99` :
              colorKey === "swapping"  ? "0 0 8px rgba(255,107,107,0.8)" :
              colorKey === "pivot"     ? "0 0 10px rgba(250,204,21,0.9)" : "none";
            return (
              <div key={index} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${(value / maxValue) * 100}%`,
                    background: barColor,
                    boxShadow: glow,
                    borderRadius: "2px 2px 0 0",
                    transition: "height 0.08s, background 0.1s",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer buttons */}
      <div className="w-full max-w-screen-xl grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {options.map(key => {
          const isCorrect  = key === currentAlgo;
          const isSelected = key === selectedOption;

          let bg     = "rgba(5,38,89,0.6)";
          let border = "1px solid rgba(84,131,179,0.3)";
          let color  = "#7DA0CA";

          if (answered !== null) {
            if (isCorrect) {
              bg = "rgba(82,183,136,0.2)";
              border = "1.5px solid #52B788";
              color = "#52B788";
            } else if (isSelected && !isCorrect) {
              bg = "rgba(255,107,107,0.2)";
              border = "1.5px solid #FF6B6B";
              color = "#FF6B6B";
            } else {
              bg = "rgba(5,38,89,0.3)";
              color = "#3A5A7A";
            }
          }

          return (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={answered !== null}
              style={{
                padding: "16px 20px", borderRadius: "14px",
                background: bg, border, color,
                fontSize: "clamp(12px,1.5vw,15px)", fontWeight: "700",
                cursor: answered !== null ? "default" : "pointer",
                transition: "all 0.25s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
              onMouseEnter={e => {
                if (answered === null) {
                  e.currentTarget.style.background = `${ALGOS[key].color}22`;
                  e.currentTarget.style.borderColor = ALGOS[key].color;
                  e.currentTarget.style.color = ALGOS[key].color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 4px 16px ${ALGOS[key].color}44`;
                }
              }}
              onMouseLeave={e => {
                if (answered === null) {
                  e.currentTarget.style.background = "rgba(5,38,89,0.6)";
                  e.currentTarget.style.borderColor = "rgba(84,131,179,0.3)";
                  e.currentTarget.style.color = "#7DA0CA";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <span>{ALGOS[key].name}</span>
              {answered !== null && (
                <span style={{ fontSize: "16px" }}>
                  {isCorrect ? "✓" : isSelected ? "✗" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {answered !== null && (
        <div
          className="w-full max-w-screen-xl rounded-2xl p-4 mt-4 fade-in"
          style={{
            background: answered === "correct"
              ? "rgba(82,183,136,0.15)"
              : "rgba(255,107,107,0.15)",
            border: answered === "correct"
              ? "1px solid rgba(82,183,136,0.4)"
              : "1px solid rgba(255,107,107,0.4)",
            textAlign: "center",
          }}
        >
          <p style={{
            fontSize: "clamp(14px,2vw,18px)", fontWeight: "800",
            color: answered === "correct" ? "#52B788" : "#FF6B6B",
            marginBottom: "6px",
          }}>
            {answered === "correct" ? "🎉 Correct!" : "❌ Wrong!"}
          </p>
          <p style={{ color: "#7DA0CA", fontSize: "13px" }}>
            {answered === "correct"
              ? `That's right — ${ALGOS[currentAlgo].name}. ${TIPS[currentAlgo]}`
              : `It was ${ALGOS[currentAlgo].name}. ${TIPS[currentAlgo]}`}
          </p>
          <p style={{ color: "#5483B3", fontSize: "11px", marginTop: "6px" }}>
            Next question in 2 seconds...
          </p>
        </div>
      )}

      <p style={{ marginTop: "16px", fontSize: "10px", color: "#5483B3" }}>
        AlgoViz Quiz Mode · AlgoViz © 2026
      </p>
    </div>
  );
}