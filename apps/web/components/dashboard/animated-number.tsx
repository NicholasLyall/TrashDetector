"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedNumberProps {
  /** Target value to animate to. */
  readonly value: number;
  /** Animation duration in milliseconds. Defaults to 600. */
  readonly duration?: number;
  /** Display formatter applied to the interpolated value each frame. */
  readonly formatter?: (n: number) => string;
}

const defaultFormatter = (n: number): string =>
  Math.round(n).toLocaleString();

/**
 * Smoothly animated number counter.
 *
 * Animates from previous value to new value using requestAnimationFrame
 * with an ease-out cubic timing function. Respects prefers-reduced-motion
 * by skipping animation and jumping to the final value.
 *
 * (D-06: animated counters on hero metrics and KPIs)
 */
export function AnimatedNumber({
  value,
  duration = 600,
  formatter = defaultFormatter,
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  const animate = useCallback(
    (from: number, to: number) => {
      // Respect prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setDisplayed(to);
        return;
      }

      const startTime = performance.now();

      function step(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic: t = 1 - (1 - progress)^3
        const eased = 1 - Math.pow(1 - progress, 3);
        const interpolated = from + (to - from) * eased;

        setDisplayed(interpolated);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
        }
      }

      frameRef.current = requestAnimationFrame(step);
    },
    [duration]
  );

  useEffect(() => {
    const from = prevValueRef.current;
    prevValueRef.current = value;

    if (from === value) {
      setDisplayed(value);
      return;
    }

    // Cancel any running animation
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    animate(from, value);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, animate]);

  return (
    <span tabIndex={-1} aria-live="polite">
      {formatter(displayed)}
    </span>
  );
}
