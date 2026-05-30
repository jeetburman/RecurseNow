import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNextReviewDate } from "@/lib/spaced-repetition";
import { Stage, Difficulty } from "@prisma/client";
export const dynamic = "force-dynamic";

// GET /api/questions - fetch all questions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");

    const now = new Date();
    now.setHours(23, 59, 59, 999);

    let where = {};

    if (filter === "today") {
      where = {
        nextReviewDate: { lte: now },
        stage: { not: Stage.MASTERED },
      };
    } else if (filter === "backlog") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      where = {
        nextReviewDate: { lt: startOfToday },
        stage: { not: Stage.MASTERED },
      };
    } else if (filter === "mastered") {
      where = { stage: Stage.MASTERED };
    }

    // Retry once — Neon free tier suspends and needs a warm-up request
    let questions;
    try {
      questions = await prisma.question.findMany({
        where,
        orderBy: { nextReviewDate: "asc" },
      });
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
      questions = await prisma.question.findMany({
        where,
        orderBy: { nextReviewDate: "asc" },
      });
    }

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/questions - add a new question
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionNumber, name, url, difficulty, stage } = body;

    if (!name || !url || !difficulty) {
      return NextResponse.json(
        { error: "name, url and difficulty are required" },
        { status: 400 }
      );
    }

    const initialStage = (stage as Stage) || Stage.ONE;
    const nextReviewDate = getNextReviewDate(initialStage);

    const question = await prisma.question.create({
      data: {
        questionNumber,
        name,
        url,
        difficulty: difficulty as Difficulty,
        stage: initialStage,
        lastReviewDate: new Date(),
        nextReviewDate,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}