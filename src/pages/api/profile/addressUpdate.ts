import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uuid, villageName, subdistrict, district } = req.body;

  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method tidak diizinkan" });

    // add member
    const data = await prisma.users.update({
      where: {
        uuid,
      },
      data: {
        address: { villageName, subdistrict, district },
      },
    });

    return res
      .status(201)
      .json({ status: true, message: "Alamat telah diubah", data });
  } catch (err: any) {
    return res.status(500).json({
      status: false,
      message: "Kesalahan server!",
      error: `${err}`,
    });
  }
}
