-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ClueAnswer" AS ENUM ('CORRECT', 'INCORRECT', 'SKIPPED');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "status" "GameStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlayer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "GamePlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClueResult" (
    "id" TEXT NOT NULL,
    "result" "ClueAnswer" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clueId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT,

    CONSTRAINT "ClueResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Game_boardId_idx" ON "Game"("boardId");

-- CreateIndex
CREATE INDEX "GamePlayer_gameId_idx" ON "GamePlayer"("gameId");

-- CreateIndex
CREATE INDEX "ClueResult_gameId_idx" ON "ClueResult"("gameId");

-- CreateIndex
CREATE INDEX "ClueResult_clueId_idx" ON "ClueResult"("clueId");

-- CreateIndex
CREATE INDEX "ClueResult_playerId_idx" ON "ClueResult"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "ClueResult_gameId_clueId_key" ON "ClueResult"("gameId", "clueId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayer" ADD CONSTRAINT "GamePlayer_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClueResult" ADD CONSTRAINT "ClueResult_clueId_fkey" FOREIGN KEY ("clueId") REFERENCES "Clue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClueResult" ADD CONSTRAINT "ClueResult_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClueResult" ADD CONSTRAINT "ClueResult_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "GamePlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
