"use client";
import { useState, useEffect, useCallback } from "react";
import { Question, Stats, Stage } from "@/types";
import StatsBar from "@/components/StatsBar";
import QuestionCard from "@/components/QuestionCard";
import AddQuestionModal from "@/components/AddQuestionModal";
import { Plus, Search } from "lucide-react";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState("today");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/questions?filter=${filter}`);
    const data = await res.json();
    setQuestions(data);
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

  const filtered = questions.filter((q) =>
    q.name.toLowerCase().includes(search.toLowerCase()) ||
    (q.questionNumber ?? "").includes(search)
  );

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Recurse<span style={{ color: "var(--accent)" }}>Now</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 mono">
            spaced repetition for DSA
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity glow-accent"
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} activeFilter={filter} onFilterChange={setFilter} />

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* Questions */}
      {loading ? (
        <div className="text-center py-20 text-[var(--text-muted)] mono text-sm">
          Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-[var(--text-muted)] mono text-sm">
            {filter === "today"
              ? "No questions due today. You're all caught up!"
              : filter === "backlog"
              ? "No backlog. Great discipline!"
              : "No questions found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onStageUpdate={handleStageUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddQuestionModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </main>
  );
}