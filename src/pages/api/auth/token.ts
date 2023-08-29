import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
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
    if (req.method !== "POST")
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
        .setHeader(
          "Set-Cookie",
          cookie.serialize("refreshToken", "", {
            httpOnly: true,
            maxAge: -1,
            path: "/",
          })
        )
        .status(400)
        .json({ status: true, message: "Cookie have been modified" });

    // verify token from cookie
    jwt.verify(
      refreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`,
      (error, decoded) => {
        if (error)
          return res
            .status(400)
            .setHeader(
              "Set-Cookie",
              cookie.serialize("refreshToken", "", {
                httpOnly: true,
                maxAge: -1,
              })
            )
            .json({ status: false, message: "Invalid token" });

        const { uuid, firstName, lastName, email } = data[0];

        // sign new access token
        const accessToken = jwt.sign(
          { uuid, firstName, lastName, email },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: "15s" }
        );
        res.json({ accessToken });
      }
    );
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
