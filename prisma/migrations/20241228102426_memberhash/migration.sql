-- CreateTable
CREATE TABLE "MemberImport" (
    "id" SERIAL NOT NULL,
    "playerCategory" "PlayerCategory" NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lineHashes" TEXT[],

    CONSTRAINT "MemberImport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberImport_playerCategory_importedAt_idx" ON "MemberImport"("playerCategory", "importedAt");
