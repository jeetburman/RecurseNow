"use client";
import { useState } from "react";
import { Question, STAGE_LABELS, STAGE_INTERVALS, Stage } from "@/types";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { ExternalLink, Trash2, Pencil } from "lucide-react";

interface Props {
  question: Question;
  onStageUpdate: (id: number, stage: Stage) => void;
  onDelete: (id: number) => void;
  onEdit: (question: Question) => void;
}

const D_COLOR  = { EASY: "var(--easy)",      MEDIUM: "var(--medium)",  HARD: "var(--hard)"      };
const D_DIM    = { EASY: "var(--green-dim)",  MEDIUM: "var(--gold-dim)", HARD: "var(--rose-dim)" };
const D_BORDER = { EASY: "#4ade8030",         MEDIUM: "#e8b84b30",       HARD: "#f26d8530"        };
const STAGES: Stage[] = ["ONE", "TWO", "THREE", "FOUR", "MASTERED"];

export default function QuestionCard({ question, onStageUpdate, onDelete, onEdit }: Props) {
  const [hover, setHover] = useState(false);
  const overdue  = isOverdue(question.nextReviewDate)  && question.stage !== "MASTERED";
  const dueToday = isDueToday(question.nextReviewDate) && question.stage !== "MASTERED";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fade-up transition-all duration-150"
      style={{
        padding: "1.25rem",
        borderRadius: "var(--radius-lg)",
        background: "var(--surface)",
        border: `1px solid ${overdue ? "#f26d8540" : dueToday ? "#7c6dfa40" : "var(--border)"}`,
      }}
    >
      {/* Row 1 — name + actions */}
      <div className="flex items-start justify-between" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center" style={{ gap: "0.5rem", marginBottom: "0.4rem" }}>
            {question.questionNumber && (
              <span className="mono text-xs" style={{ color: "var(--text-3)" }}>
                #{question.questionNumber}
              </span>
            )}
            <span
              className="text-xs font-semibold"
              style={{
                color: D_COLOR[question.difficulty],
                background: D_DIM[question.difficulty],
                border: `1px solid ${D_BORDER[question.difficulty]}`,
                padding: "1px 8px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              {question.difficulty}
            </span>
            {overdue && (
              <span
                className="text-xs font-semibold"
                style={{
                  color: "var(--rose)", background: "var(--rose-dim)",
                  border: "1px solid #f26d8540", padding: "1px 8px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Overdue
              </span>
            )}
            {dueToday && !overdue && (
              <span
                className="text-xs font-semibold"
                style={{
                  color: "var(--accent-hi)", background: "var(--accent-dim)",
                  border: "1px solid #7c6dfa40", padding: "1px 8px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Due today
              </span>
            )}
          </div>
          <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text)" }}>
            {question.name}
          </p>
        </div>

        {/* Actions */}
        <div
          className="flex items-center shrink-0 transition-opacity duration-150"
          style={{ gap: "0.25rem", opacity: hover ? 1 : 0 }}
        >
          
          <a href={question.url} target="_blank" rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: "var(--text-3)", padding: "6px", borderRadius: "var(--radius-sm)" }}
            title="Open problem"
          >
            <ExternalLink size={13} />
          </a>
          <button
            onClick={() => onEdit(question)}
            className="transition-colors"
            style={{ color: "var(--text-3)", padding: "6px", borderRadius: "var(--radius-sm)" }}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="transition-colors"
            style={{ color: "var(--rose)", padding: "6px", borderRadius: "var(--radius-sm)" }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Row 2 — dates */}
      <div className="mono text-xs flex" style={{ gap: "1.25rem", color: "var(--text-3)", marginBottom: "0.75rem" }}>
        <span>
          Last reviewed —{" "}
          <span style={{ color: "var(--text-2)" }}>{formatDate(question.lastReviewDate)}</span>
        </span>
        <span>
          Next —{" "}
          <span style={{ color: overdue ? "var(--rose)" : dueToday ? "var(--accent-hi)" : "var(--text-2)" }}>
            {formatDate(question.nextReviewDate)}
          </span>
        </span>
      </div>

      {/* Row 3 — stage pills */}
      <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
        {STAGES.map((s) => {
          const active   = question.stage === s;
          const mastered = s === "MASTERED";
          return (
            <button
              key={s}
              onClick={() => onStageUpdate(question.id, s)}
              className="text-xs font-medium transition-all duration-100"
              style={{
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                color:      active ? (mastered ? "var(--cyan)" : "var(--accent-hi)") : "var(--text-3)",
                background: active ? (mastered ? "var(--cyan-dim)" : "var(--accent-dim)") : "transparent",
                border:     active
                  ? `1px solid ${mastered ? "#3ecfcf40" : "#7c6dfa50"}`
                  : "1px solid var(--border)",
              }}
            >
              {mastered ? "✓ Mastered" : STAGE_LABELS[s]}
              {!mastered && <span style={{ marginLeft: "6px", opacity: 0.4 }}>{STAGE_INTERVALS[s]}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}