import { useRouteContext, Link, useRouter } from "@tanstack/react-router"
import { useState, createRef } from "react"
import { CreateChannelFormSchema, FormState } from "~/lib/definitions"
import { Modal, ModalInputField } from "./Modal"
import { authMiddleware } from "~/lib/middleware"
import { createServerFn } from "@tanstack/react-start"
import { prisma } from "~/lib/prisma"
import { canAccessGuild } from "./GuildList"

export const getChannel = createServerFn()
    .validator(d => d as { id: string, guildId: string, skipGuildCheck?: boolean })
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        if (data.skipGuildCheck) {
            const guild = await canAccessGuild({ data: { id: data.guildId } })

            if (!guild.success) return {
                success: false,
                message: guild.message
            }
        }

        const channel = await prisma.channel.findUnique({
            where: {
                id: data.id,
                guildId: data.guildId
            },
            include: {
                messages: {
                    include: {
                        author: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        })

        if (!channel) {
            return {
                success: false,
                message: "Unknown channel"
            }
        }
        
        return {
            success: true,
            data: channel
        }
    })

export const createChannel = createServerFn()
    .validator(d => d as { name: string, guildId: string })
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

        const channel = await prisma.channel.create({
            data: {
                name: data.name,
                guildId: data.guildId
            }
        })

        return {
            success: true,
            data: channel
        }
    })

export default function GuildList() {
    const { guild } = useRouteContext({ from: "/app/guild/$guildId" })
    const [ isOpen, setIsOpen ] = useState(false)
    const nameInput = createRef<HTMLInputElement>()
    const [ state, setState ] = useState<FormState>()
    const router = useRouter()

    async function createChannelCallback() {
        const validatedFields = CreateChannelFormSchema.safeParse({
            name: nameInput.current!.value
        })

        if (!validatedFields.success) {
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        }

        const channel = await createChannel({ data: { name: nameInput.current!.value, guildId: guild.id } })

        if (!channel.success) {
            return setState({
                errors: {
                    name: [channel.message!]
                }
            })
        }
        setIsOpen(false)

        console.log("Created channel named " + channel.data!.name + " with id " + channel.data!.id)
        router.invalidate()
    }

    return <div className="basis-60 shrink-0 bg-[#212121] flex flex-col">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row justify-between items-center">
            <p className="text-stone-200">{guild.name}</p>
            <div onClick={() => setIsOpen(true)} className="group w-5 h-5 flex items-center justify-center cursor-pointer">
                <svg className="group-hover:w-5 group-hover:h-5 transition-all ease-in-out duration-50" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
            </div>
            {isOpen &&
                <Modal title="Create a Channel" confirmLabel="Create" confirmCallback={() => createChannelCallback()} cancelCallback={() => {setIsOpen(false); setState(undefined)}}>
                    <ModalInputField ref={nameInput} name="Channel Name" error={state?.errors?.name} />
                </Modal>
            }
        </div>
        <div className="flex flex-col p-2 overflow-y-auto h-full">
            {guild.channels && guild.channels.map(channel =>
                <Link key={channel.id} to={"/app/guild/" + guild.id + "/channel/" + channel.id}>
                    <div className="group px-2 py-1 h-8 items-center flex flex-row gap-1 hover:bg-white/5 hover:rounded-[5px] cursor-pointer">
                        <img src="/assets/text.png" className="w-6 h-6"/>
                        <p className="text-gray-400 group-hover:text-gray-300">{channel.name}</p>
                    </div>
                </Link>
            )}
        </div>
    </div>
}