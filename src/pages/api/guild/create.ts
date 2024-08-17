import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

type ReqData = {
    name: string,
    ownerId: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, ownerId }: ReqData = req.body
    
    const guild = await prisma.guild.create({
        data: {
            name: name,
            ownerId: ownerId
        },
        
    })

    res.status(200).json(guild)
}