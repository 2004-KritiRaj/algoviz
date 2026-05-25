import { useRef, useState } from "react";

export function useStepPlayer() {
  const [isRunning, setIsRunning]   = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps]   = useState(0);

  const stepIndexRef = useRef(0);
  const isPausedRef  = useRef(false);
  const stepsRef     = useRef([]);
  const speedRef     = useRef(50);
  const onStepRef    = useRef(null);
  const onDoneRef    = useRef(null);
  const timeoutRef   = useRef(null);

  function play(steps, speed, onStep, onDone) {
    stepsRef.current  = steps;
    speedRef.current  = speed;
    onStepRef.current = onStep;
    onDoneRef.current = onDone;
    stepIndexRef.current = 0;
    isPausedRef.current  = false;

    setTotalSteps(steps.length);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);

    runStep();
  }

  function runStep() {
    const index = stepIndexRef.current;
    const steps = stepsRef.current;

    if (isPausedRef.current || index >= steps.length) return;

    const delay = 105 - speedRef.current;

    timeoutRef.current = setTimeout(() => {
      if (isPausedRef.current) return;

      onStepRef.current(steps[index], index);
      setCurrentStep(index + 1);
      stepIndexRef.current = index + 1;

      if (index + 1 >= steps.length) {
        setIsRunning(false);
        setIsPaused(false);
        onDoneRef.current && onDoneRef.current();
      } else {
        runStep();
      }
    }, delay);
  }

  function pause() {
    isPausedRef.current = true;
    clearTimeout(timeoutRef.current);
    setIsPaused(true);
  }

  function resume() {
    isPausedRef.current = false;
    setIsPaused(false);
    runStep();
  }

  function stop() {
    isPausedRef.current = true;
    clearTimeout(timeoutRef.current);
    stepIndexRef.current = 0;
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setTotalSteps(0);
  }

  function updateSpeed(newSpeed) {
    speedRef.current = newSpeed;
  }

  return {
    isRunning,
    isPaused,
    currentStep,
    totalSteps,
    play,
    pause,
    resume,
    stop,
    updateSpeed,
  };
}