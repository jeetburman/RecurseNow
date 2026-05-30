import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Stage } from "@prisma/client";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, dueToday, backlog, mastered, byDifficulty] =
      await Promise.all([
        prisma.question.count({ where: { stage: { not: Stage.MASTERED } } }),
        prisma.question.count({
          where: { nextReviewDate: { lte: now }, stage: { not: Stage.MASTERED } },
        }),
        prisma.question.count({
          where: {
            nextReviewDate: { lt: startOfToday },
            stage: { not: Stage.MASTERED },
          },
        }),
        prisma.question.count({ where: { stage: Stage.MASTERED } }),
        prisma.question.groupBy({
          by: ["difficulty"],
          _count: { difficulty: true },
        }),
      ]);

    return NextResponse.json({
      total,
      dueToday,
      backlog,
      mastered,
      byDifficulty,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}