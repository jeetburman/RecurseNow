"use client";
import { Stats } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  stats: Stats | null;
  activeFilter: string;
  onFilterChange: (f: string) => void;
}

export default function StatsBar({ stats, activeFilter, onFilterChange }: Props) {
  const cards = [
    { label: "Due Today", value: stats?.dueToday ?? 0, filter: "today", color: "var(--accent)" },
    { label: "Backlog", value: stats?.backlog ?? 0, filter: "backlog", color: "var(--accent-2)" },
    { label: "Active", value: stats?.total ?? 0, filter: "all", color: "var(--text)" },
    { label: "Mastered", value: stats?.mastered ?? 0, filter: "mastered", color: "var(--accent-3)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {cards.map((c) => (
        <button
          key={c.filter}
          onClick={() => onFilterChange(c.filter)}
          className={cn(
            "p-4 rounded-xl border text-left transition-all duration-200",
            activeFilter === c.filter
              ? "border-[var(--accent)] bg-[var(--surface-2)] glow-accent"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)]"
          )}
        >
          <div
            className="mono text-3xl font-bold mb-1"
            style={{ color: c.color }}
          >
            {c.value}
          </div>
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
            {c.label}
          </div>
        </button>
      ))}
    </div>
  );
}