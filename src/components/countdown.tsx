"use client";

import { useEffect, useRef, useState } from "react";

export function Countdown({ hours = 5 }: { hours?: number }) {
  const targetRef = useRef<number>(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    targetRef.current = Date.now() + hours * 60 * 60 * 1000;
    setTimeLeft(Math.max(0, targetRef.current - Date.now()));

    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, targetRef.current - Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, [hours]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return (
    <div className="rounded-2xl bg-[#1b1721] p-4 text-[#ffd27f]">
      <p className="text-xs uppercase tracking-wide text-[#f3c1d7]">Launch countdown</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{`${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`}</p>
      <p className="text-xs text-[#f8e9cf]">Stay focused and ship tonight.</p>
    </div>
  );
}
