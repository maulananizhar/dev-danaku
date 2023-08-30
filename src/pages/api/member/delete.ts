import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, ownerId, memberId } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // add member
    const data = await prisma.members.delete({
      where: {
        uuid: memberId,
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Anggota telah dihapus", data });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
