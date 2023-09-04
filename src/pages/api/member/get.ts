import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { memberId, ownerId } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // owner null
    if (ownerId == "" || ownerId == undefined)
      return res.status(400).json({
        status: false,
        message: "Masukkan owner id!",
      });

    // owner null
    if (memberId == "" || memberId == undefined)
      return res.status(400).json({
        status: false,
        message: "Masukkan member id!",
      });

    // member query
    const data = await prisma.members.findUnique({
      where: {
        ownerId,
        id: parseInt(memberId),
      },
    });

    if (!data)
      return res
        .status(400)
        .json({ status: false, message: "Anggota tidak ditemukan!" });

    return res
      .status(200)
      .json({ status: true, message: "Data telah diquery", data });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
