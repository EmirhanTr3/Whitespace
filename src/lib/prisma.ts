import { PrismaClient, Channel as PChannel, Guild as PGuild, Member as PMember, Message as PMessage, User as PUser} from "@prisma/client";

const prisma = new PrismaClient()

export default prisma

export type Guild = PGuild & {
    channels: PChannel[],
    members: PMember[]
}

export type Channel = PChannel & {
    guild: PGuild,
    messages?: Message[]
}

export type Message = PMessage & {
    author: Member
}

export type Member = PMember & {
    user: PUser
}