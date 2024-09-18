import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import prisma from "./prisma"

export async function validateSession(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({error: "Session not found"})
        return null
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    if (!user) {
        res.status(401).json({error: "Invalid user"})
        return null
    }

    return session
}