import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

// GET /api/boards - List user's boards (requires auth)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const boards = await prisma.board.findMany({
      where: { userId: session.user.id },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            clues: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error("Failed to fetch boards:", error);
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 }
    );
  }
}

// POST /api/boards - Create a new board
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        name,
        userId: session.user.id,
        categories: {
          create: Array.from({ length: 6 }, (_, i) => ({
            name: `Category ${i + 1}`,
            order: i,
            clues: {
              create: Array.from({ length: 5 }, (_, j) => ({
                value: (j + 1) * 100,
                question: "",
                answer: "",
                order: j,
              })),
            },
          })),
        },
      },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            clues: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error("Failed to create board:", error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}
