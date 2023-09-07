-- CreateTable
CREATE TABLE "Users" (
    "uuid" TEXT NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bio" TEXT NOT NULL DEFAULT '',
    "address" JSONB,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Members" (
    "uuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "moneySavings" DOUBLE PRECISION,
    "moneyLoan" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Members_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "uuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberName" VARCHAR(255) NOT NULL,
    "childId" INTEGER NOT NULL,
    "desc" TEXT,
    "type" VARCHAR(255) NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Loans" (
    "uuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberName" VARCHAR(255) NOT NULL,
    "desc" TEXT,
    "type" VARCHAR(255) NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loans_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Savings" (
    "uuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "memberName" VARCHAR(255) NOT NULL,
    "desc" TEXT,
    "type" VARCHAR(255) NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Savings_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Members_id_key" ON "Members"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Members_email_key" ON "Members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_id_key" ON "Transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Loans_id_key" ON "Loans"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Savings_id_key" ON "Savings"("id");
