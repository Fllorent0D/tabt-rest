-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MATCH', 'RANKING');

-- CreateTable
CREATE TABLE "APIConsumer" (
    "id" SERIAL NOT NULL,
    "app" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "APIConsumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchNotificationSent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent" BOOLEAN NOT NULL,
    "messageIds" TEXT[],
    "notificationType" "NotificationType" NOT NULL,

    CONSTRAINT "MatchNotificationSent_pkey" PRIMARY KEY ("id")
);
