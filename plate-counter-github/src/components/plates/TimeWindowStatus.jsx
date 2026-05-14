import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getActiveWindow, getNextWindow } from "./timeUtils";

export { getActiveWindow };

export default function TimeWindowStatus({ timeWindows }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const active = getActiveWindow(timeWindows, now);
  const next = getNextWindow(timeWindows, now);

  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
      active ? "bg-accent/10 border-border/60" : "bg-card border-border/60"
    }`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
        active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
      }`}>
        <Clock className="w-4 h-4" />
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold">
          {active ? `Fascia attiva: ${active.name}` : "Nessuna fascia attiva"}
        </div>
        <div className="text-xs text-muted-foreground">
          {active
            ? `${active.start} - ${active.end}`
            : next
              ? `Prossima fascia: ${next.name} alle ${next.start}`
              : "Aggiungi una fascia oraria dalle impostazioni"}
        </div>
      </div>
    </div>
  );
}
