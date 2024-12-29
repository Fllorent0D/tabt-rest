/*
  Warnings:

  - You are about to drop the `MemberImport` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ImportType" AS ENUM ('MEMBER', 'RESULT');

-- DropTable
DROP TABLE "MemberImport";

-- CreateTable
CREATE TABLE "DataImport" (
    "id" SERIAL NOT NULL,
    "type" "ImportType" NOT NULL,
    "playerCategory" "PlayerCategory" NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lineHashes" TEXT[],

    CONSTRAINT "DataImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataImport_type_playerCategory_importedAt_idx" ON "DataImport"("type", "playerCategory", "importedAt");
