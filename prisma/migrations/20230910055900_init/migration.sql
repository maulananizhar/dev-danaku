-- CreateTable
CREATE TABLE "Message" (
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("uuid")
);
