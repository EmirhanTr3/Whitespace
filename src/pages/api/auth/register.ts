import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { hash } from "crypto";

type ReqData = {
    email: string
    password: string
    username: string
    displayname: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password, username, displayname }: ReqData = req.body
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(email)) res.status(400).json({ error: "Invalid email." })
        
    else {
        const exists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!exists) {
            const user = await prisma.user.create({
                data: {
                    email: email,
                    password: hash("sha256", password),
                    username: username,
                    displayname: displayname
                }
            })

            res.status(200).json(user)
        } else {
            res.status(400).json({ error: "User already exists." })
        }
    }
}
