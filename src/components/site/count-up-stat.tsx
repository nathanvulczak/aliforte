"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function extractNumber(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function CountUpStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const numericValue = useMemo(() => extractNumber(value), [value]);

  useEffect(() => {
    const node = ref.current;
    if (!node || numericValue === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [numericValue]);

  useEffect(() => {
    if (!isVisible || numericValue === null) return;

    let frame = 0;
    const duration = 850;
    const startedAt = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(numericValue * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, numericValue]);

  const renderedValue =
    numericValue === null ? value : value.replace(String(numericValue), String(current));

  return (
    <div
      ref={ref}
      className="soft-card spotlight-card flex min-h-[164px] flex-col rounded-[1.9rem] px-5 py-6"
    >
      <p className="font-display text-[clamp(1.7rem,2.5vw,2.35rem)] font-semibold uppercase leading-none tracking-[0.08em] text-slate-950 break-words">
        {renderedValue}
      </p>
      <p className="mt-4 max-w-[18ch] text-sm leading-6 text-slate-600">{label}</p>
    </div>
  );
}
