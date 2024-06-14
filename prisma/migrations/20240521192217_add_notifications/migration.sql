/*
  Warnings:

  - You are about to drop the `MatchNotificationSent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MatchNotificationSent";

-- CreateTable
CREATE TABLE "MobileNotificationSent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent" BOOLEAN NOT NULL,
    "messageIds" TEXT[],
    "notificationType" "NotificationType" NOT NULL,

    CONSTRAINT "MobileNotificationSent_pkey" PRIMARY KEY ("id")
);
