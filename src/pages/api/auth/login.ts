import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  try {
    // method check
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

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

    // email validation
    if (!validator.isEmail(email))
      return res.status(400).json({
        status: false,
        message: "Format email tidak valid!",
      });

    // email check
    const data = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!data)
      return res
        .status(404)
        .json({ status: false, message: "Email tidak ditemukan!" });

    // password match
    const match = await bcrypt.compare(password, data.password);
    if (!match)
      return res
        .status(400)
        .json({ status: false, message: "Kata sandi salah!" });

    // sign jwt
    const accessToken = jwt.sign(
      {
        uuid: data.uuid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        uuid: data.uuid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      { expiresIn: "1d" }
    );

    await prisma.users.update({
      where: {
        uuid: data.uuid,
      },
      data: {
        refreshToken,
      },
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      })
    );
    res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${error}`,
    });
  }
}
