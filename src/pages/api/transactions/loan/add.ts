import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, memberId, desc, nominal } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // member null
    if (memberId == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan member id!",
      });

    // nominal null
    if (nominal == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan nominal!",
      });

    // nominal null
    if (userId == "" || userId == undefined)
      return res.status(400).json({
        status: false,
        message: "Masukkan user id!",
      });

    const user: any = await prisma.users.findUnique({
      where: {
        uuid: userId,
      },
    });

    if (user.balance < parseFloat(nominal))
      return res.status(400).json({
        status: false,
        message: "Saldo anda kurang!",
      });

    // find member
    const member: any = await prisma.members.findUnique({
      where: {
        id: parseInt(memberId),
      },
    });

    // add loans
    const data = await prisma.loans.create({
      data: {
        ownerId: member?.ownerId,
        memberId: parseInt(memberId),
        memberName: `${member?.firstName} ${member?.lastName}`,
        desc,
        type: "Pinjaman",
        nominal: parseFloat(nominal),
      },
    });

    // update members
    await prisma.members.update({
      where: {
        id: parseInt(memberId),
      },
      data: {
        moneyLoan: member?.moneyLoan + parseFloat(nominal),
      },
    });

    // create transactions
    await prisma.transactions.create({
      data: {
        ownerId: member?.ownerId,
        memberId: parseInt(memberId),
        memberName: `${member?.firstName} ${member?.lastName}`,
        childId: data.id,
        nominal: parseFloat(nominal),
        desc,
        type: "Pinjaman",
      },
    });

    await prisma.users.update({
      where: {
        uuid: userId,
      },
      data: {
        balance: (user.balance -= parseFloat(nominal)),
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Pinjaman telah ditambahkan", data });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
