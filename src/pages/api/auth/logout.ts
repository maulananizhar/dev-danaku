import { PrismaClient } from "@prisma/client";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const refreshToken = cookie.parse(`${req.headers.cookie}`).refreshToken;

    // method check
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ status: false, message: "Method not allowed" });

    // cookie check
    const data = await prisma.users.findMany({
      where: {
        refreshToken,
      },
    });
    if (data.length === 0)
      return res
        .status(400)
        .json({ status: true, message: "Cookie have been modified" });

    // update db
    const uuid = data[0].uuid;
    await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        refreshToken: null,
      },
    });

    // update cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        maxAge: -1,
        path: "/",
      })
    );
    res.status(200).json({ status: true, message: "Logout successfully!" });
  } catch (error) {
    if (error instanceof TypeError)
      return res
        .status(400)
        .json({ status: true, message: "Cookie not available" });

    return res.status(500).json({
      status: false,
      message: "Internal server error!",
      error: `${error}`,
    });
  }
}
