import React from "react";
import { X } from "lucide-react";

export default function PlateList({ plates, onRemove, compact }) {
  if (!plates.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2">
        Nessuna targa inserita.
      </div>
    );
  }

  return (
    <div className={`grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
      {plates.map((plate, index) => (
        <div
          key={`${plate}-${index}`}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/50 px-3 py-2"
        >
          <span className="font-mono font-bold tracking-widest">{plate}</span>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Rimuovi ${plate}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
