-- CreateEnum
CREATE TYPE "PlayerCategory" AS ENUM ('SENIOR_MEN', 'SENIOR_WOMEN');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('TOURNAMENT', 'CHAMPIONSHIP');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('VICTORY', 'DEFEAT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MATCH', 'RANKING');

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL,
    "licence" INTEGER NOT NULL,
    "playerCategory" "PlayerCategory" NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT,
    "ranking" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "worldRanking" INTEGER NOT NULL,
    "nationality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id","licence")
);

-- CreateTable
CREATE TABLE "NumericPoints" (
    "memberId" INTEGER NOT NULL,
    "memberLicence" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" DOUBLE PRECISION NOT NULL,
    "ranking" INTEGER,
    "rankingWI" INTEGER,
    "rankingLetterEstimation" TEXT,

    CONSTRAINT "NumericPoints_pkey" PRIMARY KEY ("memberId","memberLicence","date")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CompetitionType" NOT NULL,
    "coefficient" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndividualResult" (
    "id" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerCategory" "PlayerCategory" NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberLicence" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "opponentLicence" INTEGER NOT NULL,
    "opponentRanking" TEXT NOT NULL,
    "memberRanking" TEXT NOT NULL,
    "memberPoints" DOUBLE PRECISION,
    "opponentPoints" DOUBLE PRECISION,
    "result" "Result" NOT NULL,
    "score" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "diffPoints" DOUBLE PRECISION NOT NULL,
    "pointsToAdd" DOUBLE PRECISION NOT NULL,
    "looseFactor" DOUBLE PRECISION NOT NULL,
    "definitivePointsToAdd" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IndividualResult_pkey" PRIMARY KEY ("id","playerCategory")
);

-- CreateTable
CREATE TABLE "APIConsumer" (
    "id" SERIAL NOT NULL,
    "app" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "APIConsumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileNotificationSent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent" BOOLEAN NOT NULL,
    "messageIds" TEXT[],
    "notificationType" "NotificationType" NOT NULL,

    CONSTRAINT "MobileNotificationSent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_id_key" ON "Member"("id");

-- CreateIndex
CREATE INDEX "NumericPoints_date_idx" ON "NumericPoints"("date");

-- CreateIndex
CREATE INDEX "IndividualResult_date_idx" ON "IndividualResult"("date");

-- CreateIndex
CREATE INDEX "IndividualResult_competitionId_idx" ON "IndividualResult"("competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "APIConsumer_app_key" ON "APIConsumer"("app");

-- AddForeignKey
ALTER TABLE "NumericPoints" ADD CONSTRAINT "NumericPoints_memberId_memberLicence_fkey" FOREIGN KEY ("memberId", "memberLicence") REFERENCES "Member"("id", "licence") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualResult" ADD CONSTRAINT "IndividualResult_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualResult" ADD CONSTRAINT "IndividualResult_memberId_memberLicence_fkey" FOREIGN KEY ("memberId", "memberLicence") REFERENCES "Member"("id", "licence") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndividualResult" ADD CONSTRAINT "IndividualResult_opponentId_opponentLicence_fkey" FOREIGN KEY ("opponentId", "opponentLicence") REFERENCES "Member"("id", "licence") ON DELETE RESTRICT ON UPDATE CASCADE;
