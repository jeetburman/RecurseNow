"use client";
import { useState } from "react";
import { Difficulty, Stage } from "@/types";
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
}

export default function AddQuestionModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({
    questionNumber: "",
    name: "",
    url: "",
    difficulty: "MEDIUM" as Difficulty,
    stage: "ONE" as Stage,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.url) return;
    setLoading(true);
    await onAdd(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Add Question</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--border)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
                No.
              </label>
              <input
                type="text"
                placeholder="42"
                value={form.questionNumber}
                onChange={(e) => setForm({ ...form, questionNumber: e.target.value })}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, difficulty: d })}
                    className={cn(
                      "py-2 rounded-lg text-xs font-bold border transition-all",
                      form.difficulty === d
                        ? d === "EASY"
                          ? "border-[var(--easy)] text-[var(--easy)] bg-[var(--easy)] bg-opacity-10"
                          : d === "MEDIUM"
                          ? "border-[var(--medium)] text-[var(--medium)] bg-[var(--medium)] bg-opacity-10"
                          : "border-[var(--hard)] text-[var(--hard)] bg-[var(--hard)] bg-opacity-10"
                        : "border-[var(--border)] text-[var(--text-muted)]"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
              Question Name *
            </label>
            <input
              type="text"
              placeholder="Two Sum"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
              URL *
            </label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/two-sum"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1.5 block">
              Starting Stage
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["ONE", "TWO", "THREE", "FOUR"] as Stage[]).map((s, i) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, stage: s })}
                  className={cn(
                    "py-2 rounded-lg text-xs font-bold border transition-all",
                    form.stage === s
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)] bg-opacity-10"
                      : "border-[var(--border)] text-[var(--text-muted)]"
                  )}
                >
                  S{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface-2)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name || !form.url}
            className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Adding..." : "Add Question"}
          </button>
        </div>
      </div>
    </div>
  );
}