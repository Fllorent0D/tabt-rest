-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN');

-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('TOURNAMENT', 'CHAMPIONSHIP');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('VICTORY', 'DEFEAT');

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL,
    "licence" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "ranking" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "worldRanking" INTEGER NOT NULL,
    "nationality" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NumericPoints" (
    "memberId" INTEGER NOT NULL,
    "memberLicence" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" INTEGER NOT NULL,
    "ranking" INTEGER,
    "rankingWI" INTEGER,
    "rankingLetterEstimation" TEXT,

    CONSTRAINT "NumericPoints_pkey" PRIMARY KEY ("memberId","memberLicence","date")
);

-- CreateTable
CREATE TABLE "IndividualResult" (
    "id" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" INTEGER NOT NULL,
    "memberLicence" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "opponentLicence" INTEGER NOT NULL,
    "opponentRanking" TEXT NOT NULL,
    "memberRanking" TEXT NOT NULL,
    "memberPoints" INTEGER,
    "opponentPoints" INTEGER,
    "result" "Result" NOT NULL,
    "score" TEXT NOT NULL,
    "competitionCoef" INTEGER NOT NULL,
    "competitionType" "CompetitionType" NOT NULL,
    "competitionName" TEXT NOT NULL,
    "diffPoints" INTEGER NOT NULL,
    "pointsToAdd" INTEGER NOT NULL,
    "looseFactor" DOUBLE PRECISION NOT NULL,
    "definitivePointsToAdd" INTEGER NOT NULL,

    CONSTRAINT "IndividualResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_id_licence_key" ON "Member"("id", "licence");

-- AddForeignKey
ALTER TABLE "NumericPoints" ADD CONSTRAINT "NumericPoints_memberId_memberLicence_fkey" FOREIGN KEY ("memberId", "memberLicence") REFERENCES "Member"("id", "licence") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualResult" ADD CONSTRAINT "IndividualResult_memberId_memberLicence_fkey" FOREIGN KEY ("memberId", "memberLicence") REFERENCES "Member"("id", "licence") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualResult" ADD CONSTRAINT "IndividualResult_opponentId_opponentLicence_fkey" FOREIGN KEY ("opponentId", "opponentLicence") REFERENCES "Member"("id", "licence") ON DELETE RESTRICT ON UPDATE CASCADE;
