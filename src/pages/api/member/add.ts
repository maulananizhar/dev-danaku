import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, ownerId } = req.body;

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

    // owner null
    if (ownerId == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan owner id!",
      });

    // email validation
    if (!validator.isEmail(email))
      return res.status(400).json({
        status: false,
        message: "Format email tidak valid!",
      });

    // email check
    const duplicatedEmail = await prisma.members.findUnique({
      where: {
        email,
      },
    });
    if (duplicatedEmail)
      return res
        .status(404)
        .json({ status: false, message: "Email terpakai!" });

    // owner validator
    const ownerValidator = await prisma.users.findUnique({
      where: {
        uuid: ownerId,
      },
    });
    if (!ownerValidator)
      return res
        .status(404)
        .json({ status: false, message: "Owner tidak valid!" });

    // add member
    const data = await prisma.members.create({
      data: {
        ownerId,
        firstName,
        lastName,
        email,
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Anggota telah ditambahkan", data });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
