"use client";
import { useState, useEffect } from "react";
import { Difficulty, Stage, Question } from "@/types";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onAdd: (data: { questionNumber: string; name: string; url: string; difficulty: Difficulty; stage: Stage }) => Promise<void>;
  editQuestion?: Question | null;
  onEdit?: (id: number, data: any) => Promise<void>;
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

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.url.trim()) return;
    setLoading(true);
    editQuestion && onEdit ? await onEdit(editQuestion.id, form) : await onAdd(form);
    setLoading(false);
  };

  const D_STYLES = {
    EASY:   { color: "var(--easy)",   active: "#4ade8022", border: "#4ade8040" },
    MEDIUM: { color: "var(--medium)", active: "#e8b84b22", border: "#e8b84b40" },
    HARD:   { color: "var(--hard)",   active: "#f26d8522", border: "#f26d8540" },
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label
      className="text-xs font-medium block"
      style={{ color: "var(--text-3)", marginBottom: "0.5rem" }}
    >
      {children}
    </label>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(8,8,12,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* Modal — absolutely centered, no flex tricks */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 51,
          width: "calc(100% - 2rem)",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: "1.5rem" }}>
          <div>
            <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>
              {editQuestion ? "Edit Question" : "Add Question"}
            </h2>
            <p className="text-xs" style={{ color: "var(--text-3)", marginTop: "2px" }}>
              {editQuestion ? "Update the details below" : "Track a new DSA problem"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              color: "var(--text-3)",
              background: "var(--surface-2)",
              padding: "6px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              lineHeight: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Number + Difficulty */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ width: "80px", flexShrink: 0 }}>
              <Label>No.</Label>
              <input
                type="text"
                placeholder="42"
                value={form.questionNumber}
                onChange={(e) => setForm({ ...form, questionNumber: e.target.value })}
                className="input-field"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Difficulty</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => {
                  const s = D_STYLES[d];
                  const active = form.difficulty === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setForm({ ...form, difficulty: d })}
                      className="text-xs font-semibold transition-all"
                      style={{
                        padding: "8px",
                        borderRadius: "var(--radius-sm)",
                        color: active ? s.color : "var(--text-3)",
                        background: active ? s.active : "var(--surface-2)",
                        border: `1px solid ${active ? s.border : "var(--border)"}`,
                        cursor: "pointer",
                      }}
                    >
                      {d[0] + d.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label>Problem name <span style={{ color: "var(--accent)" }}>*</span></Label>
            <input
              type="text"
              placeholder="Two Sum"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>

          {/* URL */}
          <div>
            <Label>URL <span style={{ color: "var(--accent)" }}>*</span></Label>
            <input
              type="url"
              placeholder="https://leetcode.com/problems/two-sum"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Stage — add only */}
          {!editQuestion && (
            <div>
              <Label>Starting stage</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
                {(["ONE", "TWO", "THREE", "FOUR"] as Stage[]).map((s, i) => {
                  const active = form.stage === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, stage: s })}
                      className="text-xs font-semibold transition-all"
                      style={{
                        padding: "8px",
                        borderRadius: "var(--radius-sm)",
                        color: active ? "var(--accent-hi)" : "var(--text-3)",
                        background: active ? "var(--accent-dim)" : "var(--surface-2)",
                        border: `1px solid ${active ? "#7c6dfa50" : "var(--border)"}`,
                        cursor: "pointer",
                      }}
                    >
                      S{i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            onClick={onClose}
            className="text-sm font-medium transition-all"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-2)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.name.trim() || !form.url.trim()}
            className="text-sm font-semibold transition-all disabled:opacity-40"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading
              ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Saving...</>
              : editQuestion ? "Save Changes" : "Add Question"
            }
          </button>
        </div>
      </div>
    </>
  );
}