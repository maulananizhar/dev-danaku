import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, ownerId, page, limit } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // owner null
    if (ownerId == "" || ownerId == undefined)
      return res.status(400).json({
        status: false,
        message: "Masukkan owner id!",
      });

    // member query
    const data = await prisma.members.findMany({
      where: {
        ownerId,
        OR: [
          {
            firstName: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
      skip: (page - 1) * limit < 0 ? 0 : (page - 1) * limit,
      take: limit,
    });

    const length = await prisma.members.count({
      where: {
        ownerId,
        OR: [
          {
            firstName: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return res
      .status(200)
      .json({ status: true, message: "Data telah diquery", data, length });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
