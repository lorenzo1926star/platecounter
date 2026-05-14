import React from "react";

function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}

export default function TimerDisplay({ elapsedMs, isRunning, compact }) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div>
      <div className={`font-mono tabular-nums font-bold ${compact ? "text-2xl" : "text-4xl"}`}>
        {hours > 0
          ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
          : `${pad(minutes)}:${pad(seconds)}`}
      </div>
      <div className="text-xs text-muted-foreground">
        {isRunning ? "Timer attivo" : "Timer fermo"}
      </div>
    </div>
  );
}
