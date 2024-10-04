import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id }: { id: number } = req.body

    if (!id) {
        res.status(401).json({ status: false })
        return
    }

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if (!user) {
        res.status(401).json({ status: false })
        return
    }

    res.status(200).json({ status: true })
}