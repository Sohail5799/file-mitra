import { useEffect, useMemo, useState } from "react";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(params: {
  to: number;
  durationMs?: number;
  startDelayMs?: number;
}) {
  const durationMs = params.durationMs ?? 1100;
  const startDelayMs = params.startDelayMs ?? 0;

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(params.to);
      return;
    }

    let raf = 0;
    let startAt = 0;
    let timeout = 0 as unknown as number;

    function step(ts: number) {
      if (!startAt) startAt = ts;
      const elapsed = ts - startAt;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      setValue(Math.round(eased * params.to));
      if (t < 1) raf = requestAnimationFrame(step);
    }

    timeout = window.setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, startDelayMs);

    return () => {
      if (timeout) window.clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [durationMs, params.to, prefersReducedMotion, startDelayMs]);

  return value;
}

