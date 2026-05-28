"use client";
import { useState, useEffect } from "react";
import { Difficulty, Stage, Question } from "@/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
  onAdd: (data: {
    questionNumber: string;
    name: string;
    url: string;
    difficulty: Difficulty;
    stage: Stage;
  }) => Promise<void>;
  editQuestion?: Question | null;
  onEdit?: (id: number, data: Partial<Question>) => Promise<void>;
}

export default function AddQuestionModal({ onClose, onAdd, editQuestion, onEdit }: Props) {
  const [form, setForm] = useState({
    questionNumber: "",
    name: "",
    url: "",
    difficulty: "MEDIUM" as Difficulty,
    stage: "ONE" as Stage,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editQuestion) {
      setForm({
        questionNumber: editQuestion.questionNumber ?? "",
        name: editQuestion.name,
        url: editQuestion.url,
        difficulty: editQuestion.difficulty,
        stage: editQuestion.stage,
      });
    }
  }, [editQuestion]);

  const handleSubmit = async () => {
    if (!form.name || !form.url) return;
    setLoading(true);
    if (editQuestion && onEdit) {
      await onEdit(editQuestion.id, form);
    } else {
      await onAdd(form);
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: "rgba(8,8,16,0.85)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="glass rounded-2xl w-full max-w-md p-6 fade-up"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {editQuestion ? "Edit Question" : "Add Question"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
              {editQuestion ? "Update the details below" : "Track a new problem"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-2)" }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Number + Difficulty */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: "var(--text-3)" }}>
                No.
              </label>
              <input
                type="text"
                placeholder="42"
                value={form.questionNumber}
                onChange={(e) => setForm({ ...form, questionNumber: e.target.value })}
                className="input-base"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: "var(--text-3)" }}>
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => {
                  const colors = {
                    EASY:   { c: "var(--easy)",   bg: "rgba(77,255,210,0.12)",  b: "rgba(77,255,210,0.4)"  },
                    MEDIUM: { c: "var(--medium)", bg: "rgba(255,209,102,0.12)", b: "rgba(255,209,102,0.4)" },
                    HARD:   { c: "var(--hard)",   bg: "rgba(255,107,138,0.12)", b: "rgba(255,107,138,0.4)" },
                  }[d];
                  return (
                    <button
                      key={d}
                      onClick={() => setForm({ ...form, difficulty: d })}
                      className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        color: form.difficulty === d ? colors.c : "var(--text-3)",
                        background: form.difficulty === d ? colors.bg : "rgba(255,255,255,0.03)",
                        border: form.difficulty === d ? `1px solid ${colors.b}` : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: "var(--text-3)" }}>
              Question Name *
            </label>
            <input
              type="text"
              placeholder="Two Sum"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-base"
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: "var(--text-3)" }}>
              URL *
            </label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/two-sum"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input-base"
            />
          </div>

          {/* Stage — only show on add */}
          {!editQuestion && (
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-2 block" style={{ color: "var(--text-3)" }}>
                Starting Stage
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["ONE", "TWO", "THREE", "FOUR"] as Stage[]).map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, stage: s })}
                    className="py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      color: form.stage === s ? "var(--accent)" : "var(--text-3)",
                      background: form.stage === s ? "rgba(108,138,255,0.12)" : "rgba(255,255,255,0.03)",
                      border: form.stage === s ? "1px solid rgba(108,138,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    S{i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.url}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #6c8aff 0%, #8b6cff 100%)",
              color: "#fff",
              boxShadow: "0 0 24px rgba(108,138,255,0.3)",
            }}
          >
            {loading ? "Saving..." : editQuestion ? "Save Changes" : "Add Question"}
          </button>
        </div>
      </div>
    </div>
  );
}