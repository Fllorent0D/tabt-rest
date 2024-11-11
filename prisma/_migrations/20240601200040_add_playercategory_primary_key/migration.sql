/*
  Warnings:

  - The primary key for the `IndividualResult` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "IndividualResult" DROP CONSTRAINT "IndividualResult_pkey",
ALTER COLUMN "playerCategory" DROP DEFAULT,
ADD CONSTRAINT "IndividualResult_pkey" PRIMARY KEY ("id", "playerCategory");
