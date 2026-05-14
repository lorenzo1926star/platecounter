import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function PlateInput({ onPlateSubmit, disabled }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }

    if (disabled) {
      setValue("");
    }
  }, [disabled]);

  const handleChange = (e) => {
    if (disabled) return;

    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const trimmed = raw.slice(0, 5);
    setValue(trimmed);

    if (trimmed.length === 5) {
      onPlateSubmit(trimmed);
      setValue("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" && value.length === 5) {
      onPlateSubmit(value);
      setValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="TYPE PLATE"
          maxLength={5}
          className="font-mono text-center text-2xl md:text-3xl tracking-[0.4em] h-16 md:h-20 uppercase bg-card border-2 border-border focus:border-primary placeholder:tracking-[0.15em] placeholder:text-muted-foreground/40"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="absolute bottom-2 right-3 font-mono text-xs text-muted-foreground/50">
          {value.length}/5
        </div>
      </div>

      <div className="flex justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-all duration-150 ${
              i < value.length ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
