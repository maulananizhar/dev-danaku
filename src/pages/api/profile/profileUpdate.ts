import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uuid, firstName, lastName, email, bio } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // name null
    if (firstName == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan nama awal!",
      });

    // name null
    if (lastName == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan nama akhir!",
      });

    // email null
    if (email == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan email!",
      });

    // email validation
    if (!validator.isEmail(email))
      return res.status(400).json({
        status: false,
        message: "Format email tidak valid!",
      });

    // email check
    const duplicatedEmail = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (duplicatedEmail && email !== email)
      return res
        .status(404)
        .json({ status: false, message: "Email terpakai!" });

    // add member
    const data = await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        firstName,
        lastName,
        email,
        bio,
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Anggota telah diubah", data });
  } catch (err: any) {
    if (err.code == "P2002")
      return res
        .status(404)
        .json({ status: false, message: "Email terpakai!" });

    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
