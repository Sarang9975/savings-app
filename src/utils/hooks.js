import { useEffect, useRef, useState } from 'react';

/**
 * Animated number counter hook.
 * Given a target value, counts from the previous value to the new value.
 */
export function useCountUp(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const frame = useRef(null);

  useEffect(() => {
    const from = prev.current;
    const to = target;
    prev.current = target;

    if (from === to) return;
    if (frame.current) cancelAnimationFrame(frame.current);

    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out expo
      const ease = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(from + (to - from) * ease));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
  }, [target, duration]);

  return display;
}

/**
 * Staggered reveal for list items — returns className based on index.
 */
export function staggerClass(index) {
  const delays = ['animate-slide-up', 'animate-slide-up-d1', 'animate-slide-up-d2', 'animate-slide-up-d3', 'animate-slide-up-d4'];
  return delays[Math.min(index, delays.length - 1)];
}
