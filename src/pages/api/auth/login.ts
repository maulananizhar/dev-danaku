import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const accessTokenSecret = process.env.ACCCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  return {
    props: {
      accessTokenSecret,
      refreshTokenSecret,
    },
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const props = await getServerSideProps();

  try {
    // method check
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method not allowed" });

    // email validation
    if (!validator.isEmail(email))
      return res.status(400).json({
        status: false,
        message: "Invalid email format!",
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
        .json({ status: false, message: "Email not found!" });

    // password match
    const match = await bcrypt.compare(password, data.password);
    if (!match)
      return res
        .status(400)
        .json({ status: false, message: "Wrong password!" });

    // sign jwt
    const accessToken = jwt.sign(
      {
        uuid: data.uuid,
        name: data.name,
        email: data.email,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        uuid: data.uuid,
        name: data.name,
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
      message: "Internal server error!",
      error: `${error}`,
    });
  }
}
