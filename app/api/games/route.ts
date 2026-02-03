import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

// GET /api/games - List games (optionally filtered by boardId)
// When boardId is provided, return all games for that board (for play pages)
// When no boardId, require auth and return only user's games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const status = searchParams.get("status");

    const where: { boardId?: string; status?: "IN_PROGRESS" | "COMPLETED"; userId?: string } = {};
    if (boardId) {
      // For play pages - return all games for this board
      where.boardId = boardId;
    } else {
      // For admin - require auth and filter by user
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
      where.userId = session.user.id;
    }
    if (status === "IN_PROGRESS" || status === "COMPLETED") where.status = status;

    const games = await prisma.game.findMany({
      where,
      include: {
        board: {
          select: { name: true },
        },
        players: {
          orderBy: { order: "asc" },
        },
        clueResults: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

// POST /api/games - Create a new game
// Games can be created by anyone (for shareable play links)
// but will be associated with the user if authenticated
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { boardId, name, players } = body;

    if (!boardId || typeof boardId !== "string") {
      return NextResponse.json(
        { error: "Board ID is required" },
        { status: 400 }
      );
    }

    // Verify board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    const game = await prisma.game.create({
      data: {
        boardId,
        name: name || null,
        userId: session?.user?.id || null,
        players: {
          create: players?.map((playerName: string, i: number) => ({
            name: playerName,
            order: i,
          })) ?? [],
        },
      },
      include: {
        players: {
          orderBy: { order: "asc" },
        },
        clueResults: true,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error("Failed to create game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
