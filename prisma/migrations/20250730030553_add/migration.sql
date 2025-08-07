-- CreateTable
CREATE TABLE "title_ratings" (
    "tconst" TEXT NOT NULL,
    "average_rating" DOUBLE PRECISION,
    "num_votes" INTEGER,

    CONSTRAINT "title_ratings_pkey" PRIMARY KEY ("tconst")
);
