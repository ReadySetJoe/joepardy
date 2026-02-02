import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string; clueId: string }>;
}

// POST /api/games/[id]/clues/[clueId] - Record clue result(s)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: gameId, clueId } = await params;
    const body = await request.json();
    const { results } = body;

    // results should be an array of { playerId: string | null, result: "CORRECT" | "INCORRECT" | "SKIPPED", scoreChange: number }

    if (!results || !Array.isArray(results)) {
      return NextResponse.json(
        { error: "Results array is required" },
        { status: 400 }
      );
    }

    // Verify game exists
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Verify clue exists
    const clue = await prisma.clue.findUnique({
      where: { id: clueId },
    });

    if (!clue) {
      return NextResponse.json({ error: "Clue not found" }, { status: 404 });
    }

    // Process each result
    for (const { playerId, result, scoreChange } of results) {
      if (result !== "CORRECT" && result !== "INCORRECT" && result !== "SKIPPED") {
        continue;
      }

      // Create or update clue result
      await prisma.clueResult.upsert({
        where: {
          gameId_clueId: { gameId, clueId },
        },
        update: {
          playerId: playerId || null,
          result,
        },
        create: {
          gameId,
          clueId,
          playerId: playerId || null,
          result,
        },
      });

      // Update player score if playerId and scoreChange provided
      if (playerId && typeof scoreChange === "number") {
        await prisma.gamePlayer.update({
          where: { id: playerId },
          data: {
            score: {
              increment: scoreChange,
            },
          },
        });
      }
    }

    // Return updated game state
    const updatedGame = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          orderBy: { order: "asc" },
        },
        clueResults: true,
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error("Failed to record clue result:", error);
    return NextResponse.json(
      { error: "Failed to record clue result" },
      { status: 500 }
    );
  }
}
