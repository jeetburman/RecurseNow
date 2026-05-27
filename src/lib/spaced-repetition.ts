import { Stage } from "@prisma/client";

const STAGE_INTERVALS: Record<Stage, number | null> = {
  ONE: 2,
  TWO: 7,
  THREE: 15,
  FOUR: 30,
  MASTERED: null,
};

export function getNextReviewDate(stage: Stage): Date | null {
  const days = STAGE_INTERVALS[stage];
  if (days === null) return null;
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function getStageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    ONE: "Stage 1 — Review in 2 days",
    TWO: "Stage 2 — Review in 7 days",
    THREE: "Stage 3 — Review in 15 days",
    FOUR: "Stage 4 — Review in 30 days",
    MASTERED: "Mastered ✓",
  };
  return labels[stage];
}

export function getNextStage(stage: Stage): Stage {
  const progression: Record<Stage, Stage> = {
    ONE: TWO,
    TWO: THREE,
    THREE: FOUR,
    FOUR: MASTERED,
    MASTERED: MASTERED,
  };
  return progression[stage];
}

const { TWO, THREE, FOUR, MASTERED } = Stage;