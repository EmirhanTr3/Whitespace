import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

type ReqData = {
    name: string,
    ownerId: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const session = await getServerSession(req, res, authOptions)
        console.log(session)
        if (!session) {
            res.status(401).json({error: "Unauthorized"})
            return;
        }

        const { name, ownerId }: ReqData = req.body
        if (!name || !ownerId) {
            res.status(400).json({error: "Missing name or ownerId"})
            return;
        }

        if (ownerId != session.id) {
            res.status(401).json({error: "Id does not match current user."})
        }
        
        const guild = await prisma.guild.create({
            data: {
                name: name,
                ownerId: ownerId
            },
        })

        await prisma.guild.update({
            where: {
                id: guild.id,
            },
            data: {
                members: {
                    create: {
                        userId: ownerId,
                        guildId: guild.id
                    }
                }
            }
        })

        res.status(200).json(guild)

    } else {
        res.status(405).json({error: "Method not allowed"})
    }
}