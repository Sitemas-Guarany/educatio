import type { Serie } from "@/types";
import { cn } from "@/lib/utils";

interface SerieSelectorProps {
  value: Serie;
  onChange: (s: Serie) => void;
}

const SERIES: Serie[] = ["6", "7", "8", "9"];

export default function SerieSelector({ value, onChange }: SerieSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 animate-fade-up delay-100">
      {SERIES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            "serie-tab",
            value === s && "active"
          )}
        >
          <span className={cn(
            "text-2xl font-bold",
            value === s ? "text-ceara-verde" : "text-gray-700"
          )}>
            {s}º
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">ano</span>
        </button>
      ))}
    </div>
  );
}
