import { defineEventHandler, defineWebSocket, eventHandler } from "@tanstack/react-start/server"
import { auth } from "./auth";

export default eventHandler({
    handler() {},
    websocket: {
        async upgrade(req) {
            const session = await auth.api.getSession({ headers: req.headers })

            if (!session) {
                return new Response(null, { status: 401 });
            }

            console.log("[WS] %s (%s) connected to websocket.", session.user.name, session.user.id)
            req.context.user = session.user
        },
        async open(peer) {
            console.log("open")
        },
        async message(peer, msg) {
            console.log("message ", msg)
        },
        async close(peer, details) {
            console.log("close")
        },
        async error(peer, error) {
            console.log("error")
        }
    }
})