import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uuid, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const hash = await bcrypt.hash(newPassword, 10);

    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // name null
    if (oldPassword == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan kata sandi lama!",
      });

    // name null
    if (newPassword == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan kata sandi baru!",
      });

    // email null
    if (confirmPassword == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan konfirmasi kata sandi!",
      });

    // password match
    if (newPassword !== confirmPassword)
      return res.status(400).json({
        status: false,
        message: "Kata sandi dan Konfirmasi tidak sama!",
      });

    // password length
    if (confirmPassword.length < 8)
      return res.status(400).json({
        status: false,
        message: "Kata sandi minimal 8 karakter!",
      });

    const passwordChecker: any = await prisma.users.findUnique({
      where: {
        uuid,
      },
    });
    const match = await bcrypt.compare(oldPassword, passwordChecker.password);
    if (!match)
      return res
        .status(400)
        .json({ status: false, message: "Kata sandi lama salah!" });

    // add member
    const data = await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        password: hash,
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Kata sandi telah diubah", data });
  } catch (err: any) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
