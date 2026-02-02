import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/boards/[id] - Get a single board
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const board = await prisma.board.findUnique({
      where: { id },
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

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("Failed to fetch board:", error);
    return NextResponse.json(
      { error: "Failed to fetch board" },
      { status: 500 }
    );
  }
}

// PUT /api/boards/[id] - Update a board
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, categories } = body;

    // Update board name
    const boardUpdate = await prisma.board.update({
      where: { id },
      data: { name },
    });

    if (!boardUpdate) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    // If categories are provided, update them
    if (categories && Array.isArray(categories)) {
      // Get existing category IDs
      const existingCategories = await prisma.category.findMany({
        where: { boardId: id },
        select: { id: true },
      });
      const existingCategoryIds = new Set(existingCategories.map((c) => c.id));

      // Process each category
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];

        if (cat.id && existingCategoryIds.has(cat.id)) {
          // Update existing category
          await prisma.category.update({
            where: { id: cat.id },
            data: {
              name: cat.name,
              order: i,
            },
          });
          existingCategoryIds.delete(cat.id);

          // Update clues
          if (cat.clues && Array.isArray(cat.clues)) {
            const existingClues = await prisma.clue.findMany({
              where: { categoryId: cat.id },
              select: { id: true },
            });
            const existingClueIds = new Set(existingClues.map((c) => c.id));

            for (let j = 0; j < cat.clues.length; j++) {
              const clue = cat.clues[j];

              if (clue.id && existingClueIds.has(clue.id)) {
                // Update existing clue
                await prisma.clue.update({
                  where: { id: clue.id },
                  data: {
                    value: clue.value,
                    question: clue.question,
                    answer: clue.answer,
                    order: j,
                  },
                });
                existingClueIds.delete(clue.id);
              } else {
                // Create new clue
                await prisma.clue.create({
                  data: {
                    categoryId: cat.id,
                    value: clue.value,
                    question: clue.question,
                    answer: clue.answer,
                    order: j,
                  },
                });
              }
            }

            // Delete removed clues
            if (existingClueIds.size > 0) {
              await prisma.clue.deleteMany({
                where: { id: { in: Array.from(existingClueIds) } },
              });
            }
          }
        } else {
          // Create new category
          await prisma.category.create({
            data: {
              boardId: id,
              name: cat.name,
              order: i,
              clues: {
                create:
                  cat.clues?.map((clue: { value: number; question: string; answer: string }, j: number) => ({
                    value: clue.value,
                    question: clue.question,
                    answer: clue.answer,
                    order: j,
                  })) ?? [],
              },
            },
          });
        }
      }

      // Delete removed categories
      if (existingCategoryIds.size > 0) {
        await prisma.category.deleteMany({
          where: { id: { in: Array.from(existingCategoryIds) } },
        });
      }
    }

    // Fetch and return updated board
    const updatedBoard = await prisma.board.findUnique({
      where: { id },
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

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error("Failed to update board:", error);
    return NextResponse.json(
      { error: "Failed to update board" },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[id] - Delete a board
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete board:", error);
    return NextResponse.json(
      { error: "Failed to delete board" },
      { status: 500 }
    );
  }
}
