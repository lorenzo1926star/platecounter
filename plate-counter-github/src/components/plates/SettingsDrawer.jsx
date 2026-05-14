import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function normalizeCounters(counters) {
  return counters.map((counter) => ({
    ...counter,
    timeWindows: Array.isArray(counter.timeWindows) ? counter.timeWindows : []
  }));
}

export default function SettingsDrawer({
  open,
  onClose,
  counters,
  onUpdateCounters
}) {
  const [draftCounters, setDraftCounters] = useState([]);

  useEffect(() => {
    if (open) {
      setDraftCounters(normalizeCounters(counters));
    }
  }, [open, counters]);

  if (!open) return null;

  const updateCounter = (id, patch) => {
    setDraftCounters((prev) =>
      prev.map((counter) => counter.id === id ? { ...counter, ...patch } : counter)
    );
  };

  const addCounter = () => {
    const nextNumber = draftCounters.length + 1;
    const nextId = Date.now();

    setDraftCounters((prev) => [
      ...prev,
      {
        id: nextId,
        name: `Counter ${nextNumber}`,
        timeWindows: [
          {
            id: Date.now() + 1,
            name: "Fascia 1",
            start: "08:00",
            end: "18:00",
            enabled: true
          }
        ]
      }
    ]);
  };

  const removeCounter = (id) => {
    setDraftCounters((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((counter) => counter.id !== id);
    });
  };

  const addWindow = (counterId) => {
    setDraftCounters((prev) =>
      prev.map((counter) => {
        if (counter.id !== counterId) return counter;

        const nextNumber = counter.timeWindows.length + 1;

        return {
          ...counter,
          timeWindows: [
            ...counter.timeWindows,
            {
              id: Date.now(),
              name: `Fascia ${nextNumber}`,
              start: "08:00",
              end: "18:00",
              enabled: true
            }
          ]
        };
      })
    );
  };

  const updateWindow = (counterId, windowId, patch) => {
    setDraftCounters((prev) =>
      prev.map((counter) => {
        if (counter.id !== counterId) return counter;

        return {
          ...counter,
          timeWindows: counter.timeWindows.map((window) =>
            window.id === windowId ? { ...window, ...patch } : window
          )
        };
      })
    );
  };

  const removeWindow = (counterId, windowId) => {
    setDraftCounters((prev) =>
      prev.map((counter) => {
        if (counter.id !== counterId) return counter;

        return {
          ...counter,
          timeWindows: counter.timeWindows.filter((window) => window.id !== windowId)
        };
      })
    );
  };

  const save = () => {
    const cleaned = draftCounters.map((counter, index) => ({
      ...counter,
      name: counter.name?.trim() || `Counter ${index + 1}`,
      timeWindows: counter.timeWindows.map((window, windowIndex) => ({
        ...window,
        name: window.name?.trim() || `Fascia ${windowIndex + 1}`,
        start: window.start || "08:00",
        end: window.end || "18:00",
        enabled: Boolean(window.enabled)
      }))
    }));

    onUpdateCounters(cleaned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Chiudi impostazioni"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-background shadow-xl border-l border-border overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background border-b border-border/60 px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configura counter e fasce orarie automatiche.
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-5">
          {draftCounters.map((counter, counterIndex) => (
            <div key={counter.id} className="rounded-xl border border-border/60 bg-card p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Nome counter
                  </label>
                  <Input
                    value={counter.name}
                    onChange={(e) => updateCounter(counter.id, { name: e.target.value })}
                    className="mt-1 border-border bg-background"
                  />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeCounter(counter.id)}
                  disabled={draftCounters.length <= 1}
                  className="mt-5"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Fasce orarie</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addWindow(counter.id)}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Fascia
                  </Button>
                </div>

                {counter.timeWindows.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground text-center">
                    Nessuna fascia: questo counter non partirà automaticamente.
                  </div>
                )}

                {counter.timeWindows.map((window) => (
                  <div key={window.id} className="rounded-lg border border-border/60 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        value={window.name}
                        onChange={(e) => updateWindow(counter.id, window.id, { name: e.target.value })}
                        className="border-border bg-background"
                      />

                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={window.enabled}
                          onChange={(e) => updateWindow(counter.id, window.id, { enabled: e.target.checked })}
                        />
                        Attiva
                      </label>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWindow(counter.id, window.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs font-medium text-muted-foreground">
                        Da
                        <Input
                          type="time"
                          value={window.start}
                          onChange={(e) => updateWindow(counter.id, window.id, { start: e.target.value })}
                          className="mt-1 border-border bg-background"
                        />
                      </label>

                      <label className="text-xs font-medium text-muted-foreground">
                        A
                        <Input
                          type="time"
                          value={window.end}
                          onChange={(e) => updateWindow(counter.id, window.id, { end: e.target.value })}
                          className="mt-1 border-border bg-background"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addCounter} className="w-full gap-1.5">
            <Plus className="w-4 h-4" />
            Aggiungi counter
          </Button>

          <div className="flex gap-3 sticky bottom-0 bg-background pt-3 pb-1">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annulla
            </Button>
            <Button onClick={save} className="flex-1">
              Salva
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
