import { PrismaClient, Channel as PChannel, Guild as PGuild, Member } from "@prisma/client";

const prisma = new PrismaClient()

export default prisma

export type Guild = PGuild & {
    channels: PChannel[],
    members: Member[]
}

export type Channel = PChannel & {
    guild: PGuild
}