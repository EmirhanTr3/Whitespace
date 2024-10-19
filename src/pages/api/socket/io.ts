import { NextApiResponseServerIO, SocketWithSession } from "@/types";
import { NextApiRequest } from "next";
import { Server } from "socket.io";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        const server = new Server(res.socket.server as any, {
            path: "/api/socket/io",
            addTrailingSlash: false
        })
        
        server.use(async (socket: SocketWithSession, next) => {
            const session = await getSession({ req: socket.request })
            if (session){
                socket.session = session
                next()
            } else {
                next(new Error('Authentication error'))
            }
        })

        server.on("connection", (socket: SocketWithSession) => {
            console.log(socket.session!.user.displayname + " connected to websocket")
        })

        // @ts-ignore
        res.socket.server.io = server
    }

    res.end()
}