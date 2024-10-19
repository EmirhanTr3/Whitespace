import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

type SocketContextType = {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }: { children: JSX.Element }) {
    const [ socket, setSocket ] = useState<Socket | null>(null)
    const [ isConnected, setIsConnected ] = useState<boolean>(false)

    useEffect(() => {

        const socketInstance = io("http://localhost:3000", {
            path: "/api/socket/io",
            addTrailingSlash: false
        })

        socketInstance.on("connect", () => {
            setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return <SocketContext.Provider value={{ socket, isConnected }}>
        {children}
    </SocketContext.Provider>
}