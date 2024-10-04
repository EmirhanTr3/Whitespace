import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { validateSession } from "@/lib/utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        const session = await validateSession(req, res)
        if (!session) return;

        const { id } = req.query

        if (id) {
            if (!parseInt(id as string)) {
                res.status(400).json({error: "Invalid ID provided"})
                return;
            }

            const guild = await prisma.guild.findUnique({
                where: {
                    id: parseInt(id as string),
                    members: {
                        some: {
                            userId: session.user.id
                        }
                    }
                },
                include: {
                    members: true,
                    channels: true
                }
            })

            if (!guild) {
                res.status(400).json({error: "Guild not found"})
                return;
            }

            res.status(200).json(guild)
            return;
        }

        const guilds = await prisma.guild.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        })

        res.status(200).json(guilds)

    } else if (req.method == "POST") {
        const session = await validateSession(req, res)
        if (!session) return;

        const { name }: { name: string } = req.body
        if (!name) {
            res.status(400).json({error: "Missing guild name"})
            return;
        }
        
        const guild = await prisma.guild.create({
            data: {
                name: name,
                ownerId: session.user.id
            },
        })

        await prisma.guild.update({
            where: {
                id: guild.id,
            },
            data: {
                members: {
                    create: {
                        userId: session.user.id,
                        guildId: guild.id
                    }
                },
                channels: {
                    create: {
                        name: "General"
                    }
                }
            }
        })

        res.status(200).json(guild)

    } else {
        res.status(405).json({error: "Method not allowed"})
    }
}