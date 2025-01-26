/*
  Warnings:

  - You are about to drop the column `lineHashes` on the `DataImport` table. All the data in the column will be lost.
  - Added the required column `hash` to the `DataImport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataImport" DROP COLUMN "lineHashes",
ADD COLUMN     "hash" TEXT NOT NULL;
