"use client";
import { Question, STAGE_LABELS, STAGE_INTERVALS, Stage } from "@/types";
import { formatDate, isOverdue, isDueToday } from "@/lib/utils";
import { ExternalLink, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  onStageUpdate: (id: number, stage: Stage) => void;
  onDelete: (id: number) => void;
}

const DIFFICULTY_COLORS = {
  EASY: "var(--easy)",
  MEDIUM: "var(--medium)",
  HARD: "var(--hard)",
};

const STAGES: Stage[] = ["ONE", "TWO", "THREE", "FOUR", "MASTERED"];

export default function QuestionCard({ question, onStageUpdate, onDelete }: Props) {
  const overdue = isOverdue(question.nextReviewDate);
  const dueToday = isDueToday(question.nextReviewDate);

  return (
    <div
      className={cn(
        "group p-4 rounded-xl border bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-2)]",
        overdue && question.stage !== "MASTERED"
          ? "border-[var(--accent-2)] glow-red"
          : dueToday
          ? "border-[var(--accent)] glow-accent"
          : "border-[var(--border)]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {question.questionNumber && (
              <span className="mono text-xs text-[var(--text-muted)]">
                #{question.questionNumber}
              </span>
            )}
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: DIFFICULTY_COLORS[question.difficulty] }}
            >
              {question.difficulty}
            </span>
            {overdue && question.stage !== "MASTERED" && (
              <span className="text-xs bg-[var(--accent-2)] text-black font-bold px-2 py-0.5 rounded-full">
                OVERDUE
              </span>
            )}
            {dueToday && (
              <span className="text-xs bg-[var(--accent)] text-black font-bold px-2 py-0.5 rounded-full">
                TODAY
              </span>
            )}
          </div>
          <h3 className="font-semibold text-[var(--text)] truncate">{question.name}</h3>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          <a>
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => onDelete(question.id)}
            className="p-1.5 rounded-lg hover:bg-[var(--accent-2)] hover:bg-opacity-20 text-[var(--text-muted)] hover:text-[var(--accent-2)] transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-4 mb-4 text-xs text-[var(--text-muted)] mono">
        <span>Last: {formatDate(question.lastReviewDate)}</span>
        <span>Next: {formatDate(question.nextReviewDate)}</span>
      </div>

      {/* Stage Selector */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-[var(--text-muted)] mr-1">Stage:</span>
        {STAGES.map((s) => (
          <button
            key={s}
            onClick={() => onStageUpdate(question.id, s)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 font-medium",
              question.stage === s
                ? s === "MASTERED"
                  ? "border-[var(--accent-3)] bg-[var(--accent-3)] bg-opacity-20 text-[var(--accent-3)]"
                  : "border-[var(--accent)] bg-[var(--accent)] bg-opacity-20 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)]"
            )}
          >
            {s === "MASTERED" ? "✓ Mastered" : STAGE_LABELS[s]}
            {s !== "MASTERED" && (
              <span className="ml-1 opacity-60">{STAGE_INTERVALS[s]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}