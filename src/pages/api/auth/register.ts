import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Users } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    // method check
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

    // password null
    if (password == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan kata sandi!",
      });

    // password null
    if (confirmPassword == "")
      return res.status(400).json({
        status: false,
        message: "Masukkan konfirmasi kata sandi!",
      });

    // password match
    if (password !== confirmPassword)
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

    // email duplicated
    const duplicated = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (duplicated)
      return res
        .status(400)
        .json({ status: false, message: "Email tidak tersedia!" });

    // email validation
    if (!validator.isEmail(email))
      return res.status(400).json({
        status: false,
        message: "Format email tidak valid!",
      });

    // create user
    const data = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
      },
    });
    return res
      .status(201)
      .json({ status: true, message: "Akun telah dibuat!", data });
  } catch (err) {}
}
