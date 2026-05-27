export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Stage = "ONE" | "TWO" | "THREE" | "FOUR" | "MASTERED";

export interface Question {
  id: number;
  questionNumber: string | null;
  name: string;
  url: string;
  difficulty: Difficulty;
  stage: Stage;
  lastReviewDate: string | null;
  nextReviewDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  dueToday: number;
  backlog: number;
  mastered: number;
  byDifficulty: { difficulty: Difficulty; _count: { difficulty: number } }[];
}

export const STAGE_LABELS: Record<Stage, string> = {
  ONE: "Stage 1",
  TWO: "Stage 2",
  THREE: "Stage 3",
  FOUR: "Stage 4",
  MASTERED: "Mastered",
};

export const STAGE_INTERVALS: Record<Stage, string> = {
  ONE: "+2 days",
  TWO: "+7 days",
  THREE: "+15 days",
  FOUR: "+30 days",
  MASTERED: "Done",
};