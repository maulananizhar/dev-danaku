import { verifyToken } from "@/middleware/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ status: false, message: "Method not allowed" });

    res.status(200).json({ message: "Protected route" });
  } catch (error) {
    console.log(error);
  }
}

export default verifyToken(handler);
