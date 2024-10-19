import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { validateSession } from "@/lib/utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        const session = await validateSession(req, res)
        if (!session) return;

        const { id } = req.query

        if (!parseInt(id as string)) {
            res.status(400).json({error: "Invalid ID provided"})
            return;
        }

        const channel = await prisma.channel.findUnique({
            where: {
                id: parseInt(id as string)
            },
            include: {
                guild: true,
                messages: {
                    include: {
                        author: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        })

        if (!channel) {
            res.status(400).json({error: "Channel not found"})
            return;
        }

        const guild = await prisma.guild.findUnique({
            where: {
                id: channel.guildId,
                members: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        })

        if (!guild) {
            res.status(403).json({error: "User is not a member of guild"})
            return;
        }

        res.status(200).json(channel)

    } else if (req.method == "POST") {
        const session = await validateSession(req, res)
        if (!session) return;

        const { name, guildId }: { name: string, guildId: number } = req.body
        if (!name || !guildId) {
            res.status(400).json({error: "Missing channel name or guild id"})
            return;
        }

        const guild = await prisma.guild.findUnique({
            where: {
                id: guildId
            }
        })

        if (!guild) {
            res.status(400).json({error: "Invalid guild"})
            return;
        }

        if (guild.ownerId != session.user.id) {
            res.status(403).json({error: "Guild is not owned by current user"})
            return
        }
        
        const channel = await prisma.channel.create({
            data: {
                name: name,
                guildId: guildId
            },
        })

        res.status(200).json(channel)

    } else {
        res.status(405).json({error: "Method not allowed"})
    }
}