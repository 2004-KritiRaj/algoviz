export function useSound() {
  let audioCtx = null;

  function getCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playTone({ frequency = 440, type = "sine", duration = 0.1, volume = 0.3 }) {
    try {
      const ctx = getCtx();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // silently fail if audio not supported
    }
  }

  function playCompare(value, maxValue) {
    const freq = 200 + (value / maxValue) * 600; // 200Hz to 800Hz
    playTone({ frequency: freq, type: "sine", duration: 0.08, volume: 0.15 });
  }

  function playSwap(value, maxValue) {
    const freq = 150 + (value / maxValue) * 500;
    playTone({ frequency: freq, type: "sawtooth", duration: 0.12, volume: 0.2 });
  }

  function playSorted() {
    playTone({ frequency: 880, type: "sine", duration: 0.15, volume: 0.2 });
  }

  function playDone() {
    // Ascending chord — plays 4 notes with small delays
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => {
        playTone({ frequency: freq, type: "sine", duration: 0.4, volume: 0.25 });
      }, i * 100);
    });
  }

  return { playCompare, playSwap, playSorted, playDone };
}