import { Link, useRouteContext } from "@tanstack/react-router"
import { useState, createRef, useEffect } from "react"
import { CreateGuildFormSchema, FormState } from "~/lib/definitions"
import { Modal, ModalInputField } from "./Modal"
import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "~/lib/middleware"
import { prisma } from "~/lib/prisma"
import { Guild } from "@prisma/client"

export const canAccessGuild = createServerFn()
    .validator(d => d as { id: string })
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        const count = await prisma.guild.count({
            where: {
                id: data.id,
                members: {
                    some: {
                        userId: context.user.id
                    }
                }
            }
        })

        return {
            success: count > 0
        }
    })

export const getGuild = createServerFn()
    .validator(d => d as { id: string })
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        const guild = await prisma.guild.findUnique({
            where: {
                id: data.id,
                members: {
                    some: {
                        userId: context.user.id
                    }
                }
            },
            include: {
                channels: true
            }
        })

        if (!guild) {
            return {
                success: false,
                message: "Unknown guild"
            }
        }
        
        return {
            success: true,
            data: guild
        }
    })

export const getGuilds = createServerFn()
    .middleware([ authMiddleware ])
    .handler(async ({ context}) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        const guilds = await prisma.guild.findMany({
            where: {
                members: {
                    some: {
                        userId: context.user.id
                    }
                }
            }
        })

        return {
            success: true,
            data: guilds
        }
    })

export const createGuild = createServerFn()
    .validator(CreateGuildFormSchema)
    .middleware([ authMiddleware ])
    .handler(async ({ context, data }) => {
        if (!context.user) return {
            success: false,
            message: "Not authenticated"
        }

        const guild = await prisma.guild.create({
            data: {
                name: data.name,
                ownerId: context.user.id,
                members: {
                    create: {
                        userId: context.user.id
                    }
                },
                channels: {
                    create: {
                        name: "General"
                    }
                }
            }
        })

        return {
            success: true,
            data: guild
        }
    })

export default function GuildList() {
    const { user } = useRouteContext({ from: "/app" })
    const [ guilds, setGuilds ] = useState<Guild[] | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ state, setState ] = useState<FormState>()
    const nameInput = createRef<HTMLInputElement>()

    async function createGuildCallback() {
        const validatedFields = CreateGuildFormSchema.safeParse({
            name: nameInput.current!.value
        })

        if (!validatedFields.success) {
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        }

        const guild = await createGuild({ data: { name: nameInput.current!.value } })

        if (!guild.success) {
            return setState({
                errors: {
                    name: [guild.message!]
                }
            })
        }
        setIsOpen(false)

        console.log("Created guild named " + guild.data!.name + " with id " + guild.data!.id)
        loadGuilds()
    }

    async function loadGuilds() {
        const guilds = await getGuilds()
        if (!guilds.success) return console.error("An error occured while loading guilds!\n", guilds.message)
        console.log("Loaded " + guilds.data!.length + " guilds.")
        setGuilds(guilds.data!)
    }
    
    useEffect(() => {
        loadGuilds()
    }, [])

    return <div className="bg-neutral-900 basis-[72px] shrink-0 py-3 pb-14 flex flex-col items-center gap-2 overflow-y-auto">
        {guilds && guilds.map(guild =>
            <Link key={guild.id} to={"/app/guild/" + guild.id}>
                <div className="w-[48px] h-[48px] group">
                    <div className="w-[4px] h-[48px] absolute left-0 flex items-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 bg-white w-full h-[20px] rounded-r-md"/>
                    </div>
                    {guild.icon ?
                        <img className="transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] group-hover:rounded-2xl duration-300 cursor-pointer" src={guild.icon} /> :
                        <p className="flex items-center justify-center transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] group-hover:rounded-2xl duration-300 cursor-pointer bg-neutral-800 group-hover:bg-[#5865f2] group-hover:text-white">{guild.name.split(" ").map(l => l.substring(0, 1)).join("")}</p>
                    }
                </div>
            </Link>
        )}
        <div className="w-[48px] h-[48px]">
            <button onClick={() => setIsOpen(true)} className="group flex items-center justify-center transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] hover:rounded-2xl duration-300 cursor-pointer bg-neutral-800 hover:bg-[#23a559]">
                <svg className="transition-all ease-in-out duration-300 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#23a559" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
            </button>
        </div>
        {isOpen &&
            <Modal title="Create a Server" confirmLabel="Create" confirmCallback={createGuildCallback} cancelCallback={() => {setIsOpen(false); setState(undefined)}}>
                <ModalInputField ref={nameInput} name="Server Name" defaultValue={user.displayname + "'s Server"} error={state?.errors?.name}/>
            </Modal>
        }
    </div>
}