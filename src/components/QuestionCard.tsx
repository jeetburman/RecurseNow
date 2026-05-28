"use client";
import { useState } from "react";
import { Question, STAGE_LABELS, STAGE_INTERVALS, Stage } from "@/types";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { ExternalLink, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  onStageUpdate: (id: number, stage: Stage) => void;
  onDelete: (id: number) => void;
  onEdit: (question: Question) => void;
}

const DIFFICULTY_STYLES = {
  EASY:   { color: "var(--easy)",   bg: "rgba(77,255,210,0.08)",   border: "rgba(77,255,210,0.2)"   },
  MEDIUM: { color: "var(--medium)", bg: "rgba(255,209,102,0.08)",  border: "rgba(255,209,102,0.2)"  },
  HARD:   { color: "var(--hard)",   bg: "rgba(255,107,138,0.08)",  border: "rgba(255,107,138,0.2)"  },
};

const STAGES: Stage[] = ["ONE", "TWO", "THREE", "FOUR", "MASTERED"];

export default function QuestionCard({ question, onStageUpdate, onDelete, onEdit }: Props) {
  const [hovering, setHovering] = useState(false);
  const overdue  = isOverdue(question.nextReviewDate) && question.stage !== "MASTERED";
  const dueToday = isDueToday(question.nextReviewDate);
  const ds = DIFFICULTY_STYLES[question.difficulty];

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="glass rounded-2xl p-5 transition-all duration-300 fade-up"
      style={{
        borderColor: overdue
          ? "rgba(255,107,138,0.35)"
          : dueToday
          ? "rgba(108,138,255,0.35)"
          : undefined,
        boxShadow: overdue
          ? "0 0 24px rgba(255,107,138,0.08)"
          : dueToday
          ? "0 0 24px rgba(108,138,255,0.08)"
          : undefined,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {question.questionNumber && (
              <span className="mono text-xs px-2 py-0.5 rounded-md"
                style={{ color: "var(--text-3)", background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)" }}>
                #{question.questionNumber}
              </span>
            )}
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-md"
              style={{ color: ds.color, background: ds.bg, border: `1px solid ${ds.border}` }}
            >
              {question.difficulty}
            </span>
            {overdue && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md"
                style={{ color: "var(--rose)", background: "rgba(255,107,138,0.1)", border: "1px solid rgba(255,107,138,0.3)" }}>
                OVERDUE
              </span>
            )}
            {dueToday && !overdue && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md"
                style={{ color: "var(--accent)", background: "rgba(108,138,255,0.1)", border: "1px solid rgba(108,138,255,0.3)" }}>
                DUE TODAY
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
            {question.name}
          </h3>
        </div>

        {/* Action buttons */}
        <div
          className="flex items-center gap-1.5 transition-all duration-200 shrink-0"
          style={{ opacity: hovering ? 1 : 0 }}
        >
          
          <a  href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-2)" }}
          >
            <ExternalLink size={13} />
          </a>
          <button
            onClick={() => onEdit(question)}
            className="p-2 rounded-xl transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-2)" }}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 rounded-xl transition-all duration-150"
            style={{ background: "rgba(255,107,138,0.08)", color: "var(--rose)" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-5 mb-4 mono text-xs" style={{ color: "var(--text-3)" }}>
        <span>Last reviewed: <span style={{ color: "var(--text-2)" }}>{formatDate(question.lastReviewDate)}</span></span>
        <span>Next: <span style={{ color: overdue ? "var(--rose)" : dueToday ? "var(--accent)" : "var(--text-2)" }}>{formatDate(question.nextReviewDate)}</span></span>
      </div>

      {/* Stage selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {STAGES.map((s) => {
          const isActive = question.stage === s;
          const isMastered = s === "MASTERED";
          return (
            <button
              key={s}
              onClick={() => onStageUpdate(question.id, s)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-150"
              style={{
                background: isActive
                  ? isMastered ? "rgba(77,255,210,0.12)" : "rgba(108,138,255,0.12)"
                  : "rgba(255,255,255,0.03)",
                border: isActive
                  ? isMastered ? "1px solid rgba(77,255,210,0.4)" : "1px solid rgba(108,138,255,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                color: isActive
                  ? isMastered ? "var(--cyan)" : "var(--accent)"
                  : "var(--text-3)",
              }}
            >
              {isMastered ? "✓ Mastered" : `${STAGE_LABELS[s]}`}
              {!isMastered && (
                <span className="ml-1.5 opacity-50">{STAGE_INTERVALS[s]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}