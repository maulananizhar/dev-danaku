import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, ownerId, page, limit, sort, filter } = req.body;

  function sorter(params: string): any {
    const mappings: any = {
      idAsc: { id: "asc" },
      idDesc: { id: "desc" },
      nominalAsc: { nominal: "asc" },
      nominalDesc: { nominal: "desc" },
      dateAsc: { createdAt: "asc" },
      dateDesc: { createdAt: "desc" },
    };
    return mappings[params] || {};
  }

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
    const data: any = await prisma.loans.findMany({
      where: {
        ownerId,
        OR: [
          {
            memberName: {
              contains: name,
              mode: "insensitive",
            },
            type: {
              contains: filter,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: sorter(sort),
      skip: (page - 1) * limit < 0 ? 0 : (page - 1) * limit,
      take: limit,
    });

    const length = await prisma.loans.count({
      where: {
        ownerId,
        OR: [
          {
            memberName: {
              contains: name,
              mode: "insensitive",
            },
            type: {
              contains: filter,
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
