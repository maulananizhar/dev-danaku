import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Users } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    // method check
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method not allowed" });

    // email duplicated
    const duplicated = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (duplicated)
      return res
        .status(200)
        .json({ status: false, message: "Email is not available" });

    // password match
    if (password !== confirmPassword)
      return res.status(400).json({
        status: false,
        message: "Password and confirm password not match",
      });

    // email validation
    if (!validator.isEmail(email))
      return res.status(400).json({
        status: false,
        message: "Invalid email format!",
      });

    // create user
    const data = await prisma.users.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
    return res
      .status(201)
      .json({ status: true, message: "User created!", data });
  } catch (err) {}
}
