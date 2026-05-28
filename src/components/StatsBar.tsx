"use client";
import { Stats } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  stats: Stats | null;
  activeFilter: string;
  onFilterChange: (f: string) => void;
}

const CARDS = [
  {
    filter: "today",
    label: "Due Today",
    key: "dueToday" as keyof Stats,
    color: "var(--accent)",
    glow: "rgba(108,138,255,0.2)",
    activeBorder: "rgba(108,138,255,0.5)",
    icon: "◈",
  },
  {
    filter: "backlog",
    label: "Backlog",
    key: "backlog" as keyof Stats,
    color: "var(--rose)",
    glow: "rgba(255,107,138,0.2)",
    activeBorder: "rgba(255,107,138,0.5)",
    icon: "◉",
  },
  {
    filter: "all",
    label: "Active",
    key: "total" as keyof Stats,
    color: "var(--text)",
    glow: "rgba(255,255,255,0.1)",
    activeBorder: "rgba(255,255,255,0.3)",
    icon: "◎",
  },
  {
    filter: "mastered",
    label: "Mastered",
    key: "mastered" as keyof Stats,
    color: "var(--cyan)",
    glow: "rgba(77,255,210,0.2)",
    activeBorder: "rgba(77,255,210,0.5)",
    icon: "◆",
  },
];

export default function StatsBar({ stats, activeFilter, onFilterChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {CARDS.map((card, i) => {
        const value = typeof stats?.[card.key] === "number" ? stats[card.key] : 0;
        const isActive = activeFilter === card.filter;

        return (
          <button
            key={card.filter}
            onClick={() => onFilterChange(card.filter)}
            className="glass rounded-2xl p-5 text-left transition-all duration-300 group"
            style={{
              animationDelay: `${i * 60}ms`,
              borderColor: isActive ? card.activeBorder : undefined,
              boxShadow: isActive ? `0 0 30px ${card.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span
                className="text-lg opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color: card.color }}
              >
                {card.icon}
              </span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: card.color, boxShadow: `0 0 6px ${card.color}` }}
                />
              )}
            </div>
            <div
              className="mono text-4xl font-bold mb-1 tabular-nums"
              style={{ color: card.color }}
            >
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.12em]"
              style={{ color: "var(--text-3)" }}>
              {card.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}