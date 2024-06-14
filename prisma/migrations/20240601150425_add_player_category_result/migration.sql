/*
  Warnings:

  - Added the required column `playerCategory` to the `IndividualResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IndividualResult" ADD COLUMN     "playerCategory" "PlayerCategory" NOT NULL;
