import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, message } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // name null
    if (name == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan nama!",
      });

    // message null
    if (message == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan pesan!",
      });

    // add member
    const data = await prisma.message.create({
      data: {
        name,
        message,
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Pesan telah ditambahkan", data });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
