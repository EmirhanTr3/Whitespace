import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { createContext, useContext, useEffect, useState } from 'react';
import { getWebRequest } from 'vinxi/http';
import { GuildList } from '~/components'
import { auth } from '~/lib/auth';

const getUser = createServerFn()
    .handler(async () => {
        const { headers } = getWebRequest()!;
        const session = await auth.api.getSession({ headers });
    
        return session?.user || null;
    })

export const Route = createFileRoute('/app')({
    beforeLoad: async () => {
        const session = await getUser()
        if (!session) throw redirect({ to: "/login" })
        return { user: session }
    },
    component: Home
})

export const WebsocketContext = createContext<WebSocket | null>(null)

function Home() {
    const { user } = Route.useRouteContext()
    const [ ws, setWs ] = useState<WebSocket | null>(null)
    
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000/_ws")
        setWs(ws)

        ws.addEventListener("open", () => {
            console.log("[WS] Connected to websocket.")
        })

        ws.addEventListener("message", (event) => {
            console.log("[WS] Received message:", event.data)
        })
        
        ws.addEventListener("error", (error) => {
            console.error("[WS] WebSocket Error:", error)
        })

        ws.addEventListener("close", () => {
            console.log("[WS] Disconnected from websocket.")
        })

        return () => {
            ws.close();
        }
    }, [])

    return <>
        <div className="flex flex-row grow-1">
            <WebsocketContext.Provider value={ws}>
                <GuildList />
                <Outlet />
            </WebsocketContext.Provider>
        </div>
        <div className="h-14 w-[312px] bg-neutral-900 border-t border-r border-neutral-950 absolute bottom-0">
            <div className="flex flex-row align-center p-2">
                {user.avatar ?
                    <img className="w-10 h-10 rounded-[50%]" src={user.avatar} /> :
                    <img className="w-10 h-10 rounded-[50%]" src="/favicon.ico" />
                }
                <div className="flex flex-col pl-2 justify-center">
                    <p className="text-white text-[13px] h-4">{user.displayname}</p>
                    <p className="text-neutral-400 text-[11px] h-4">{user.name}</p>
                </div>
            </div>
        </div>
    </>
}