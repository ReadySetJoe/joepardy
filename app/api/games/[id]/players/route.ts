import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/games/[id]/players - Add a player to the game
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: gameId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    // Get current player count to determine order
    const playerCount = await prisma.gamePlayer.count({
      where: { gameId },
    });

    const player = await prisma.gamePlayer.create({
      data: {
        gameId,
        name,
        order: playerCount,
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("Failed to add player:", error);
    return NextResponse.json(
      { error: "Failed to add player" },
      { status: 500 }
    );
  }
}

// PUT /api/games/[id]/players - Update player scores (batch)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: gameId } = await params;
    const body = await request.json();
    const { players } = body;

    if (!players || !Array.isArray(players)) {
      return NextResponse.json(
        { error: "Players array is required" },
        { status: 400 }
      );
    }

    // Update each player's score
    for (const { id, score } of players) {
      if (id && typeof score === "number") {
        await prisma.gamePlayer.update({
          where: { id, gameId },
          data: { score },
        });
      }
    }

    // Return updated players
    const updatedPlayers = await prisma.gamePlayer.findMany({
      where: { gameId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(updatedPlayers);
  } catch (error) {
    console.error("Failed to update players:", error);
    return NextResponse.json(
      { error: "Failed to update players" },
      { status: 500 }
    );
  }
}
