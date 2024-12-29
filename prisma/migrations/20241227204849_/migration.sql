/*
  Warnings:

  - You are about to alter the column `score` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(3)`.

*/
-- AlterTable
ALTER TABLE "IndividualResult" ALTER COLUMN "opponentRanking" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "memberRanking" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "score" SET DATA TYPE VARCHAR(3);
