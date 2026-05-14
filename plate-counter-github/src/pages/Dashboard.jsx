import React, { useState, useRef, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Keyboard } from "lucide-react";
import CounterPanel from "@/components/plates/CounterPanel";
import SessionHistory from "@/components/plates/SessionHistory";
import SettingsDrawer from "@/components/plates/SettingsDrawer";
import TimeWindowStatus from "@/components/plates/TimeWindowStatus";
import { getActiveWindow } from "@/components/plates/timeUtils";
import { loadJson, saveJson } from "@/lib/storage";

function makeCounter(id, name) {
  return {
    id,
    name,
    timeWindows: [
      {
        id: 1,
        name: "Fascia 1",
        start: "08:00",
        end: "18:00",
        enabled: true
      }
    ]
  };
}

const INITIAL_COUNTER = makeCounter(1, "Counter 1");

export default function Dashboard() {
  const [counters, setCounters] = useState(() => loadJson("plate-counter:counters", [INITIAL_COUNTER]));
  const [sessions, setSessions] = useState(() => loadJson("plate-counter:sessions", []));
  const [activeTab, setActiveTab] = useState("entry");
  const [activeCounterId, setActiveCounterId] = useState(() => counters[0]?.id ?? 1);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    saveJson("plate-counter:counters", counters);
  }, [counters]);

  useEffect(() => {
    saveJson("plate-counter:sessions", sessions);
  }, [sessions]);

  const saveSession = useCallback((counterId, plates, duration) => {
    const counter = counters.find((item) => item.id === counterId);

    setSessions((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        counterId,
        counterName: counter?.name || `Counter ${counterId}`,
        plates: [...plates],
        duration,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  }, [counters]);

  useEffect(() => {
    setSessions((prev) =>
      prev.map((session) => {
        const counter = counters.find((item) => item.id === session.counterId);
        return counter ? { ...session, counterName: counter.name } : session;
      })
    );
  }, [counters]);

  const handleUpdateCounters = (updated) => {
    setCounters(updated);

    if (!updated.find((counter) => counter.id === activeCounterId)) {
      setActiveCounterId(updated[0]?.id);
    }
  };

  const handleClearHistory = () => setSessions([]);

  const allWindows = counters.flatMap((counter) =>
    (counter.timeWindows || []).map((window) => ({
      ...window,
      counterId: counter.id,
      counterName: counter.name,
      name: `${counter.name} · ${window.name}`
    }))
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Plate Counter</h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="gap-1.5 h-9"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {allWindows.length > 0 && (
          <TimeWindowStatus timeWindows={allWindows} />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 h-11">
            <TabsTrigger value="entry" className="text-sm font-medium">
              Counters
              <span className="ml-1.5 text-muted-foreground text-xs">({counters.length})</span>
            </TabsTrigger>

            <TabsTrigger value="history" className="text-sm font-medium">
              History
              {sessions.length > 0 && (
                <span className="ml-1.5 bg-primary/15 text-primary px-1.5 py-0.5 rounded-full text-xs font-bold tabular-nums">
                  {sessions.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entry" className="mt-4 space-y-4">
            {counters.map((counter) => (
              <CounterWithState
                key={counter.id}
                counter={counter}
                isActive={activeCounterId === counter.id}
                onSetActive={() => setActiveCounterId(counter.id)}
                saveSession={saveSession}
              />
            ))}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <SessionHistory sessions={sessions} onClear={handleClearHistory} />
          </TabsContent>
        </Tabs>
      </main>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        counters={counters}
        onUpdateCounters={handleUpdateCounters}
      />
    </div>
  );
}

function CounterWithState({ counter, isActive, onSetActive, saveSession }) {
  const [plates, setPlates] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [autoShouldRun, setAutoShouldRun] = useState(false);

  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const isRunningRef = useRef(false);
  const platesRef = useRef([]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    platesRef.current = plates;
  }, [plates]);

  useEffect(() => {
    const check = () => {
      const activeWindow = getActiveWindow(counter.timeWindows || []);
      setAutoShouldRun(Boolean(activeWindow));
    };

    check();

    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [counter.timeWindows]);

  const tick = useCallback(() => {
    if (startTimeRef.current) {
      setElapsedMs(Date.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    startTimeRef.current = Date.now();
    setIsRunning(true);
    isRunningRef.current = true;
    setElapsedMs(0);
    setPlates([]);
    platesRef.current = [];

    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (!isRunningRef.current) return;

    cancelAnimationFrame(rafRef.current);

    const finalElapsed = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0;

    setIsRunning(false);
    isRunningRef.current = false;
    startTimeRef.current = null;

    if (platesRef.current.length > 0) {
      saveSession(counter.id, platesRef.current, finalElapsed);
    }

    setPlates([]);
    platesRef.current = [];
    setElapsedMs(0);
  }, [counter.id, saveSession]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);

    setIsRunning(false);
    isRunningRef.current = false;
    startTimeRef.current = null;

    setPlates([]);
    platesRef.current = [];
    setElapsedMs(0);
  }, []);

  useEffect(() => {
    if (autoShouldRun) {
      start();
    } else {
      stop();
    }
  }, [autoShouldRun, start, stop]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePlateSubmit = (plate) => {
    if (!isRunningRef.current) return;

    setPlates((prev) => {
      const next = [...prev, plate];
      platesRef.current = next;
      return next;
    });
  };

  const handleRemovePlate = (index) => {
    setPlates((prev) => {
      const next = prev.filter((_, i) => i !== index);
      platesRef.current = next;
      return next;
    });
  };

  return (
    <CounterPanel
      counter={{
        name: counter.name,
        plates,
        isRunning,
        elapsedMs,
        onStop: stop,
        onReset: reset,
        onPlateSubmit: handlePlateSubmit,
        onRemovePlate: handleRemovePlate
      }}
      isActive={isActive}
      onSetActive={onSetActive}
    />
  );
}
