/** Notification chime using Web Audio API. */
export function playBellSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const notes = [
      { freq: 659.25, start: 0, duration: 0.55, gain: 0.14, type: 'triangle' },
      { freq: 830.61, start: 0.22, duration: 0.55, gain: 0.12, type: 'triangle' },
      { freq: 987.77, start: 0.44, duration: 0.6, gain: 0.11, type: 'sine' },
      { freq: 1318.51, start: 0.7, duration: 0.85, gain: 0.1, type: 'sine' },
      { freq: 987.77, start: 1.15, duration: 0.7, gain: 0.07, type: 'triangle' },
    ];

    notes.forEach(({ freq, start, duration, gain: gainValue, type }) => {
      const t = now + start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(gainValue, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(gainValue * 0.45, t + duration * 0.45);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duration + 0.08);
    });

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 2200);
  } catch {
    // Audio may be blocked by the browser
  }
}
