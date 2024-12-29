/*
  Warnings:

  - You are about to alter the column `opponentRanking` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - You are about to alter the column `memberRanking` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2)`.
  - You are about to alter the column `memberPoints` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,2)`.
  - You are about to alter the column `opponentPoints` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,2)`.
  - You are about to alter the column `score` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `diffPoints` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,2)`.
  - You are about to alter the column `pointsToAdd` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.
  - You are about to alter the column `looseFactor` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(3,2)`.
  - You are about to alter the column `definitivePointsToAdd` on the `IndividualResult` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(6,2)`.

*/
-- AlterTable
ALTER TABLE "IndividualResult" ALTER COLUMN "opponentRanking" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "memberRanking" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "memberPoints" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "opponentPoints" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "score" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "diffPoints" SET DATA TYPE DECIMAL(6,2),
ALTER COLUMN "pointsToAdd" SET DATA TYPE SMALLINT,
ALTER COLUMN "looseFactor" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "definitivePointsToAdd" SET DATA TYPE DECIMAL(6,2);
