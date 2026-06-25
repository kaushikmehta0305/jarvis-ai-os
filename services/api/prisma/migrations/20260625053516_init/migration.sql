CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "memories" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "base_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);
