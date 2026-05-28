"use client";
import { useState, useEffect, useCallback } from "react";
import { Question, Stats, Stage } from "@/types";
import StatsBar from "@/components/StatsBar";
import QuestionCard from "@/components/QuestionCard";
import AddQuestionModal from "@/components/AddQuestionModal";
import { Plus, Search } from "lucide-react";

const FILTER_LABELS: Record<string, string> = {
  today: "Due Today", backlog: "Backlog", all: "All Active", mastered: "Mastered",
};

export default function Home() {
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [stats, setStats]               = useState<Stats | null>(null);
  const [filter, setFilter]             = useState("today");
  const [search, setSearch]             = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [loading, setLoading]           = useState(true);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/stats");
    setStats(await res.json());
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/questions?filter=${filter}`);
    setQuestions(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchQuestions(); fetchStats(); }, [fetchQuestions, fetchStats]);

  const handleStageUpdate = async (id: number, stage: Stage) => {
    await fetch(`/api/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    fetchQuestions(); fetchStats();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    fetchQuestions(); fetchStats();
  };

  const handleAdd = async (data: any) => {
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowModal(false);
    fetchQuestions(); fetchStats();
  };

  const handleEdit = async (id: number, data: any) => {
    await fetch(`/api/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditQuestion(null);
    fetchQuestions(); fetchStats();
  };

  const filtered = questions.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      (q.questionNumber ?? "").includes(search)
  );

  return (
    <main className="min-h-screen mx-auto px-8 py-12 md:px-12 md:py-16" style={{ maxWidth: "680px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span
              className="mono text-xs font-medium px-2 py-0.5 rounded-md"
              style={{ background: "var(--accent-dim)", color: "var(--accent-hi)", border: "1px solid #7c6dfa30" }}
            >
              DSA
            </span>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
              RecurseNow
            </h1>
          </div>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            Spaced repetition tracker · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Plus size={14} />
          Add Question
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} activeFilter={filter} onFilterChange={setFilter} />

      {/* Search + count */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-8"
          />
        </div>
        <div
          className="mono text-xs px-3 py-2 rounded-lg shrink-0"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}
        >
          {FILTER_LABELS[filter]} · <span style={{ color: "var(--accent-hi)" }}>{filtered.length}</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-24">
          <div className="spinner" />
          <p className="mono text-xs" style={{ color: "var(--text-3)" }}>Loading...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <p className="font-medium text-sm" style={{ color: "var(--text-2)" }}>
            {filter === "today"    ? "All caught up for today 🎯"  :
             filter === "backlog"  ? "No backlog — great streak ✨" :
             filter === "mastered" ? "Nothing mastered yet 🏆"      :
             "No questions found"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            {filter === "today" || filter === "backlog"
              ? "Come back tomorrow or add new questions"
              : "Add a question to get started"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((q, i) => (
            <div key={q.id} style={{ animationDelay: `${i * 30}ms` }}>
              <QuestionCard
                question={q}
                onStageUpdate={handleStageUpdate}
                onDelete={handleDelete}
                onEdit={setEditQuestion}
              />
            </div>
          ))}
        </div>
      )}

      {showModal && <AddQuestionModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      {editQuestion && (
        <AddQuestionModal
          onClose={() => setEditQuestion(null)}
          onAdd={handleAdd}
          editQuestion={editQuestion}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}