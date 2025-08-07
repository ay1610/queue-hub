-- CreateTable
CREATE TABLE "runtime_data" (
    "tconst" VARCHAR(20) NOT NULL,
    "title_type" VARCHAR(20),
    "primary_title" TEXT,
    "runtime_minutes" INTEGER,

    CONSTRAINT "runtime_data_pkey" PRIMARY KEY ("tconst")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "fromUserId" VARCHAR NOT NULL,
    "toUserId" VARCHAR NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" VARCHAR NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_recommendation" ON "Recommendation"("fromUserId", "toUserId", "mediaId", "mediaType");
