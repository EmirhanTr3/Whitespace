import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { hash } from "crypto";
import { RegisterFormSchema } from "@/lib/definitions";

type ReqData = {
    email: string
    password: string
    username: string
    displayname: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password, username, displayname }: ReqData = req.body
    const validatedFields = RegisterFormSchema.safeParse({
        username: username,
        displayname: displayname,
        email: email,
        password: password
    })

    if (!validatedFields.success) {
        res.status(400).json({ error: validatedFields.error.flatten().fieldErrors })

    } else {
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
                    displayname: displayname,
                    username: username
                },
            })
            const member = await prisma.member.create({
                data: {
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                }
            })

            res.status(200).json(user)
        } else {
            res.status(400).json({ error: "User already exists." })
        }
    }
}
