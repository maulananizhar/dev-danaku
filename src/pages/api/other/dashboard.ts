import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    const user = await prisma.users.findUnique({
      where: {
        uuid: userId,
      },
    });
    const transaction = await prisma.transactions.count({
      where: {
        ownerId: userId,
      },
    });
    const member = await prisma.members.count({
      where: {
        ownerId: userId,
      },
    });
    const memberLoan = await prisma.members.findMany({
      where: {
        ownerId: userId,
      },
    });
    const lastTransactions = await prisma.transactions.findMany({
      where: {
        ownerId: userId,
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    const userBalance = user?.balance;

    let loanTotal: any = 0;

    for (let i = 0; i < memberLoan.length; i++) {
      loanTotal += memberLoan[i]?.moneyLoan;
    }

    const data = {
      userBalance,
      loanTotal,
      transaction,
      member,
      lastTransactions,
    };

    return res
      .status(200)
      .json({ status: true, message: "Data telah diquery", data });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
