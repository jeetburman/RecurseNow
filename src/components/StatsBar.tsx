"use client";
import { Stats } from "@/types";

interface Props {
  stats: Stats | null;
  activeFilter: string;
  onFilterChange: (f: string) => void;
}

const CARDS = [
  { filter: "today",   label: "Due Today", key: "dueToday" as keyof Stats, color: "var(--accent)",  dim: "var(--accent-dim)"  },
  { filter: "backlog", label: "Backlog",   key: "backlog"  as keyof Stats, color: "var(--rose)",    dim: "var(--rose-dim)"    },
  { filter: "all",     label: "Active",    key: "total"    as keyof Stats, color: "var(--text)",    dim: "rgba(255,255,255,0.04)" },
  { filter: "mastered",label: "Mastered",  key: "mastered" as keyof Stats, color: "var(--cyan)",    dim: "var(--cyan-dim)"    },
] as const;

export default function StatsBar({ stats, activeFilter, onFilterChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "1rem", marginBottom: "2rem" }}>
      {CARDS.map((c) => {
        const val = typeof stats?.[c.key] === "number" ? (stats[c.key] as number) : 0;
        const active = activeFilter === c.filter;
        return (
          <button
            key={c.filter}
            onClick={() => onFilterChange(c.filter)}
            className="text-left transition-all duration-150"
            style={{
              padding: "1.25rem",
              borderRadius: "var(--radius-lg)",
              background: active ? c.dim : "var(--surface)",
              border: `1px solid ${active ? c.color + "55" : "var(--border)"}`,
            }}
          >
            <div
              className="mono text-3xl font-semibold tabular-nums"
              style={{ color: c.color, marginBottom: "0.25rem" }}
            >
              {val}
            </div>
            <div
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--text-3)" }}
            >
              {c.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}