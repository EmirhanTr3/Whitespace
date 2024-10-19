import prisma from "@/lib/prisma"
import { NextApiRequest } from "next"
import { validateSession } from "@/lib/utils"
import { NextApiResponseServerIO, SocketWithSession } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method == "GET") {
        const session = await validateSession(req, res)
        if (!session) return;

        const { id } = req.query

        if (!parseInt(id as string)) {
            res.status(400).json({error: "Invalid ID provided"})
            return;
        }

        const message = await prisma.message.findUnique({
            where: {
                id: parseInt(id as string)
            },
            include: {
                author: {
                    include: {
                        user: true
                    }
                }
            }
        })

        if (!message) {
            res.status(400).json({error: "Message not found"})
            return;
        }

        const channel = await prisma.channel.findUnique({
            where: {
                id: message.channelId
            },
            select: {
                guildId: true
            }
        })


        if (!channel) {
            res.status(400).json({error: "Unknown channel"})
            return
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

        res.status(200).json(message)

    } else if (req.method == "POST") {
        const session = await validateSession(req, res)
        if (!session) return;

        const { channelId, content }: { channelId: number, content: string } = req.body
        if (!channelId || !content) {
            res.status(400).json({error: "Missing channel id or message content"})
            return;
        }

        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId
            }
        })

        if (!channel) {
            res.status(400).json({error: "Unknown channel"})
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
            },
            include: {
                members: true
            }
        })

        if (!guild) {
            res.status(403).json({error: "Unknown guild"})
            return
        }

        const member = await prisma.member.findFirst({
            where: {
                guildId: guild.id,
                userId: session.user.id,
            }
        })

        if (!member) {
            res.status(403).json({error: "Unknown member"})
            return
        }
        
        const message = await prisma.message.create({
            data: {
                authorId: member.id,
                channelId: channel.id,
                content: content
            },
        })

        res.status(200).json(message)
        // @ts-ignore
        const sockets: SocketWithSession[] = await res.socket.server.io.fetchSockets()

        for (const socket of sockets) {
            if (guild.members.find(member => member.userId == socket.session!.user.id)) {
                socket.emit("chat:message", message)
            }
        }

    } else {
        res.status(405).json({error: "Method not allowed"})
    }
}