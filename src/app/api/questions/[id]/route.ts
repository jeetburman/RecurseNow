import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNextReviewDate } from "@/lib/spaced-repetition";
import { Stage, Difficulty } from "@prisma/client";

// PATCH /api/questions/:id - update stage or details
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { stage, name, url, difficulty, questionNumber } = body;

    const updateData: any = {};

    if (stage) {
      updateData.stage = stage as Stage;
      updateData.lastReviewDate = new Date();
      updateData.nextReviewDate = getNextReviewDate(stage as Stage);
    }

    if (name) updateData.name = name;
    if (url) updateData.url = url;
    if (difficulty) updateData.difficulty = difficulty as Difficulty;
    if (questionNumber !== undefined)
      updateData.questionNumber = questionNumber;

    const question = await prisma.question.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}

// GET /api/questions/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const question = await prisma.question.findUnique({ where: { id } });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}