import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function SessionHistory({ sessions, onClear }) {
  if (!sessions.length) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="py-10 text-center">
          <div className="text-sm text-muted-foreground">
            Nessuna sessione salvata.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">History</h2>
          <p className="text-sm text-muted-foreground">{sessions.length} sessioni salvate</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClear} className="gap-1.5">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {sessions.map((session) => (
        <Card key={session.id} className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{session.counterName || `Counter ${session.counterId}`}</CardTitle>
                <p className="text-xs text-muted-foreground">{formatDate(session.timestamp)}</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold">{formatDuration(session.duration)}</div>
                <div className="text-xs text-muted-foreground">{session.plates.length} targhe</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {session.plates.map((plate, index) => (
                <span
                  key={`${plate}-${index}`}
                  className="rounded-md border border-border/60 bg-muted px-2 py-1 font-mono text-xs font-bold tracking-widest"
                >
                  {plate}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
