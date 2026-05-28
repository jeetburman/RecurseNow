"use client";
import { useState, useEffect, useCallback } from "react";
import { Question, Stats, Stage } from "@/types";
import StatsBar from "@/components/StatsBar";
import QuestionCard from "@/components/QuestionCard";
import AddQuestionModal from "@/components/AddQuestionModal";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

export default function Home() {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [filter, setFilter]         = useState("today");
  const [search, setSearch]         = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [loading, setLoading]       = useState(true);

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

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [fetchQuestions, fetchStats]);

  const handleStageUpdate = async (id: number, stage: Stage) => {
    await fetch(`/api/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    fetchQuestions();
    fetchStats();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this question?")) return;
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    fetchQuestions();
    fetchStats();
  };

  const handleAdd = async (data: any) => {
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowModal(false);
    fetchQuestions();
    fetchStats();
  };

  const handleEdit = async (id: number, data: any) => {
    await fetch(`/api/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditQuestion(null);
    fetchQuestions();
    fetchStats();
  };

  const filtered = questions.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      (q.questionNumber ?? "").includes(search)
  );

  const FILTER_LABELS: Record<string, string> = {
    today: "Due Today",
    backlog: "Backlog",
    all: "All Active",
    mastered: "Mastered",
  };

  return (
    <main className="min-h-screen px-4 py-10 md:px-10 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
              style={{ background: "linear-gradient(135deg, #6c8aff, #8b6cff)", boxShadow: "0 0 20px rgba(108,138,255,0.4)" }}
            >
              R
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Recurse<span style={{ color: "var(--accent)" }}>Now</span>
            </h1>
          </div>
          <p className="mono text-xs ml-11" style={{ color: "var(--text-3)" }}>
            spaced repetition · DSA mastery
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #6c8aff 0%, #8b6cff 100%)",
            color: "#fff",
            boxShadow: "0 0 24px rgba(108,138,255,0.3)",
          }}
        >
          <Plus size={15} />
          Add Question
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} activeFilter={filter} onFilterChange={setFilter} />

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-3)" }}
          />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9"
          />
        </div>
        <div
          className="mono text-xs px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--text-3)" }}
        >
          {FILTER_LABELS[filter]}
          <span className="ml-2" style={{ color: "var(--accent)" }}>{filtered.length}</span>
        </div>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
          />
          <p className="mono text-xs" style={{ color: "var(--text-3)" }}>Loading questions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
          >
            {filter === "today" ? "🎯" : filter === "backlog" ? "✨" : filter === "mastered" ? "🏆" : "📭"}
          </div>
          <div className="text-center">
            <p className="font-semibold mb-1" style={{ color: "var(--text-2)" }}>
              {filter === "today"
                ? "All caught up!"
                : filter === "backlog"
                ? "No backlog — great discipline!"
                : filter === "mastered"
                ? "Nothing mastered yet"
                : "No questions found"}
            </p>
            <p className="mono text-xs" style={{ color: "var(--text-3)" }}>
              {filter === "today"
                ? "No questions due today"
                : filter === "backlog"
                ? "Keep up the consistency"
                : "Add a question to get started"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((q, i) => (
            <div key={q.id} style={{ animationDelay: `${i * 40}ms` }}>
              <QuestionCard
                question={q}
                onStageUpdate={handleStageUpdate}
                onDelete={handleDelete}
                onEdit={(q) => setEditQuestion(q)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <AddQuestionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
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