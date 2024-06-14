/*
  Warnings:

  - You are about to drop the column `gender` on the `Member` table. All the data in the column will be lost.
  - Added the required column `playerCategory` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlayerCategory" AS ENUM ('MEN', 'WOMEN');

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "gender",
ADD COLUMN     "playerCategory" "PlayerCategory" NOT NULL;

-- DropEnum
DROP TYPE "Gender";
