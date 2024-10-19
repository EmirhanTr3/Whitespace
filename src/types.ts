import { Server as NetServer, Socket} from "net";
import { NextApiResponse } from "next";
import { Session } from "next-auth";
import { Socket as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server:  NetServer & {
            io: SocketIOServer
        }
    }
}

export type SocketWithSession = SocketIOServer & {
    session?: Session
}