import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { hash } from "crypto";

type ReqData = {
    email: string
    password: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password }: ReqData = req.body
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) res.status(400)

    else {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
                password: hash("sha256", password)
            }
        })

        if (user) {
            res.status(200).json(user)
        } else {
            res.status(400)
        }
    }
}
