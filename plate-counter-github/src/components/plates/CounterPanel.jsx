import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Square, RotateCcw, Hash, Clock } from "lucide-react";
import TimerDisplay from "./TimerDisplay";
import PlateInput from "./PlateInput";
import PlateList from "./PlateList";

export default function CounterPanel({ counter, isActive, onSetActive }) {
  const {
    name,
    plates,
    isRunning,
    elapsedMs,
    onStop,
    onReset,
    onPlateSubmit,
    onRemovePlate
  } = counter;

  return (
    <Card className={`border shadow-sm transition-all ${isActive ? "border-primary/40 shadow-primary/5" : "border-border/60"}`}>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isActive && (
              <button
                onClick={onSetActive}
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              >
                Switch
              </button>
            )}

            {isActive && (
              <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-accent animate-pulse" : "bg-muted-foreground/40"}`} />
            )}

            <CardTitle className="text-base font-semibold">{name}</CardTitle>
          </div>

          {isRunning && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Hash className="w-3.5 h-3.5" />
              <span className="tabular-nums font-bold text-foreground">{plates.length}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TimerDisplay elapsedMs={elapsedMs} isRunning={isRunning} compact />

          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={onStop}
                className="gap-1.5 h-9 px-4 text-sm"
              >
                <Square className="w-3.5 h-3.5" />
                Stop & Save
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border/60 rounded-md h-9 px-3">
                <Clock className="w-3.5 h-3.5" />
                In attesa fascia
              </div>
            )}

            {(isRunning || plates.length > 0) && (
              <Button
                size="sm"
                variant="outline"
                onClick={onReset}
                className="gap-1.5 h-9 px-3 text-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {isActive && (
          <PlateInput onPlateSubmit={onPlateSubmit} disabled={!isRunning} />
        )}

        {(plates.length > 0 || isRunning) && (
          <div className="border-t border-border/50 pt-3">
            <PlateList
              plates={plates}
              onRemove={isRunning ? onRemovePlate : null}
              compact
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
