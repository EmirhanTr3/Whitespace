import { Channel, Message } from "@/lib/prisma";
import { createRef, FormEvent, useEffect, useState } from "react";
import { useSocket } from "./providers/SocketProvider";

export default function ChannelInfo({ channel }: { channel: Channel }) {
    const socket = useSocket()
    const input = createRef<HTMLInputElement>()
    const [ messages, setMessages ] = useState<Message[]>(channel.messages!)

    async function sendMessage(event: FormEvent) {
        event.preventDefault()
        const message = input.current!.value
        if (!message || message.replaceAll(" ", "").length == 0) return;
        input.current!.value = ""

        await fetch("/api/messages", {
            method: 'POST',
            body: JSON.stringify({
                channelId: channel.id,
                content: message
            }),
            headers: { "Content-Type": "application/json" }
        })
    }

    useEffect(() => {
        socket.socket?.removeAllListeners("chat:message")
        
        socket.socket?.on("chat:message", async (msg) => {
            console.log(msg)
            const message: Message = await (await fetch(`/api/messages?id=${msg.id}`)).json()
            console.log(message)
            setMessages([...messages, message])
        })
    })

    return <div className="flex flex-col grow-[1]">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row items-center gap-2">
            <img src="/assets/text.png" className="w-6 h-6"/>
            <p className="text-stone-200">{channel.name}</p>
            <p className="text-white">{socket.isConnected ? "socket is connected" : "socket is not connected"}</p>
        </div>
        <div className="flex flex-col py-3 grow-[1] gap-2 overflow-y-auto">
            {messages && messages.map(message =>
                <div key={message.id} className="flex flex-row gap-2 items-center px-3 py-0.5 hover:bg-white hover:bg-opacity-5 hover:rounded-[4px]">
                    <img className="w-12 h-12" src="/favicon.ico"/>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                            <p className="text-stone-300">{message.author.user.displayname}</p>
                            <p className="text-neutral-500 text-xs">{message.createdAt.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-neutral-400">{message.content}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="p-3">
            <form onSubmit={sendMessage}>
                <input ref={input} className="py-2.5 px-3 rounded-lg w-full bg-[#212121] outline-0 text-neutral-400" type="text" placeholder="Send a message to current channel"/>
            </form>
        </div>
    </div>
}