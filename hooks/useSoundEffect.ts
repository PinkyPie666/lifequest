"use client";

import { useCallback, useRef } from "react";

type SoundType = "click" | "success" | "levelup" | "coin" | "error" | "navigate" | "toggle" | "complete";

const SOUND_CONFIGS: Record<SoundType, { freq: number; duration: number; type: OscillatorType; pattern?: number[] }> = {
  click: { freq: 800, duration: 50, type: "square" },
  success: { freq: 523, duration: 150, type: "square", pattern: [523, 659, 784] },
  levelup: { freq: 440, duration: 100, type: "square", pattern: [440, 554, 659, 880] },
  coin: { freq: 988, duration: 80, type: "square", pattern: [988, 1319] },
  error: { freq: 200, duration: 200, type: "sawtooth" },
  navigate: { freq: 600, duration: 40, type: "square" },
  toggle: { freq: 700, duration: 30, type: "square", pattern: [700, 900] },
  complete: { freq: 523, duration: 100, type: "square", pattern: [523, 659, 784, 1047] },
};

export function useSoundEffect() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const play = useCallback((sound: SoundType) => {
    try {
      const ctx = getContext();
      const config = SOUND_CONFIGS[sound];
      const frequencies = config.pattern || [config.freq];
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = config.type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);

        const startTime = ctx.currentTime + (i * config.duration) / 1000;
        const endTime = startTime + config.duration / 1000;

        osc.start(startTime);
        osc.stop(endTime);
      });

      const totalDuration = (frequencies.length * config.duration) / 1000;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + totalDuration);
    } catch {
      // Silently fail if audio is not available
    }
  }, [getContext]);

  return { play };
}
