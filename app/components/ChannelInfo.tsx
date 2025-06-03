import { useRouteContext, useRouter } from "@tanstack/react-router"
import { createRef, FormEvent, useContext, useState } from "react"
import { getChannel } from "./GuildInfo"
import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "~/lib/middleware"
import { prisma } from "~/lib/prisma"
import { canAccessGuild } from "./GuildList"
import { WebsocketContext } from "~/routes/app/route"

export const getMember = createServerFn()
    .validator(d => d as { userId: string, guildId: string })
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }
        
        const guild = await canAccessGuild({ data: { id: data.guildId } })
        
        if (!guild.success) return {
            success: false,
            message: guild.message
        }

        const member = await prisma.member.findFirst({
            where: {
                userId: context.user.id,
                guildId: data.guildId
            },
            include: {
                user: true
            }
        })

        if (!member) return {
            success: false,
            message: "Unknown member"
        }

        return {
            success: true,
            data: member
        }
    })

export const getMessages = createServerFn()
    .validator(d => d as { channelId: string, guildId: string })
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        const guild = await canAccessGuild({ data: { id: data.guildId } })
        
        if (!guild.success) return {
            success: false,
            message: guild.message
        }

        const messages = await prisma.message.findMany({
            where: {
                channelId: data.channelId
            },
            include: {
                author: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return {
            success: true,
            data: messages
        }
    })

export const createMessage = createServerFn()
    .validator(d => d as { content: string, channelId: string, guildId: string })
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        const channel = await getChannel({ data: { id: data.channelId, guildId: data.guildId } })

        if (!channel.success) return {
            success: false,
            message: channel.message
        }
        
        const member = await getMember({ data: { userId: context.user.id, guildId: data.guildId } })

        if (!member.success) return {
            success: false,
            message: member.message
        }

        const message = await prisma.message.create({
            data: {
                content: data.content,
                authorId: member.data!.id,
                channelId: data.channelId
            }
        })

        return {
            success: true,
            data: message
        }
    })

export default function ChannelInfo() {
    const { channel } = useRouteContext({ from: "/app/guild/$guildId/channel/$channelId" })
    const input = createRef<HTMLInputElement>()
    const [ messages, setMessages ] = useState<typeof channel.messages>(channel.messages)
    const ws = useContext(WebsocketContext)

    async function sendMessage(event: FormEvent) {
        event.preventDefault()
        const message = input.current!.value
        if (!message || message.replaceAll(" ", "").length == 0) return;
        input.current!.value = ""

        console.log(ws?.readyState)

        ws?.send("test")

        // await createMessage({ data: { content: message, channelId: channel.id, guildId: channel.guildId } })
        console.log("Sent message " + message + " in channel " + channel.id)

        // const messages = await getMessages({ data: { channelId: channel.id, guildId: channel.guildId } })

        // if (!messages.success) return console.error("An error occured while loading messages!\n", messages.message)
        // console.log("Loaded " + messages.data!.length + " messages.")
        // setMessages(messages.data!)
    }

    return <div className="flex flex-col grow-[1]">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row items-center gap-2">
            <img src="/assets/text.png" className="w-6 h-6"/>
            <p className="text-stone-200">{channel.name}</p>
        </div>
        <div className="flex flex-col py-3 grow-[1] gap-2 overflow-y-auto">
            {messages.map(message =>
                <div key={message.id} className="flex flex-row gap-2 items-center px-3 py-0.5 hover:bg-white/5 hover:rounded-[4px]">
                    {message.author.user.avatar ?
                        <img className="w-12 h-12 rounded-[50%]" src={message.author.user.avatar} /> :
                        <img className="w-12 h-12 rounded-[50%]" src="/favicon.ico" />
                    }
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