import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/games/[id] - Get a single game
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        players: {
          orderBy: { order: "asc" },
        },
        clueResults: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

// PUT /api/games/[id] - Update a game (name, status)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, status } = body;

    const data: { name?: string | null; status?: "IN_PROGRESS" | "COMPLETED" } = {};
    if (name !== undefined) data.name = name;
    if (status === "IN_PROGRESS" || status === "COMPLETED") data.status = status;

    const game = await prisma.game.update({
      where: { id },
      data,
      include: {
        players: {
          orderBy: { order: "asc" },
        },
        clueResults: true,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Failed to update game:", error);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// DELETE /api/games/[id] - Delete a game
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete game:", error);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
