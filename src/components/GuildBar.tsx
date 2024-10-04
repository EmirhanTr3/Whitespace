import { FormState, CreateGuildFormSchema } from "@/lib/definitions"
import { Guild } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useState, createRef, useEffect } from "react"
import { Modal, ModalInputField } from "."
import Link from "next/link"

export default function GuildBar() {
    const [ guilds, setGuilds ] = useState<Guild[] | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ state, setState ] = useState<FormState>()
    const nameInput = createRef<HTMLInputElement>()
    const session = useSession()
    
    async function createGuild() {
        const validatedFields = CreateGuildFormSchema.safeParse({
            name: nameInput.current!.value
        })
        if (!validatedFields.success) {
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        }

        setIsOpen(false)
        setState(undefined)

        const response = await fetch("/api/guilds", {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput.current!.value
            }),
            headers: { "Content-Type": "application/json" }
        })

        console.log(response)
    }

    useEffect(() => {
        async function fetchData() {
            if (!guilds) {
                const guilds = await (await fetch("/api/guilds")).json()
                setGuilds(guilds)
            }
        }

        fetchData()
    })

    return <>
        <div className="bg-neutral-900 basis-[72px] shrink-0 py-3 flex flex-col items-center gap-2 overflow-y-auto">
            {guilds && guilds.map(guild =>
                <Link key={guild.id} href={"/guild/" + guild.id}>
                    <div className="w-[48px] h-[48px] group">
                        <div className="w-[4px] h-[48px] absolute left-0 flex items-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 bg-white w-full h-[20px] rounded-r-md"/>
                        </div>
                        {guild.icon ?
                            <img className="transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] group-hover:rounded-2xl duration-300 cursor-pointer" src={guild.icon} /> :
                            <p className="flex items-center justify-center transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] group-hover:rounded-2xl duration-300 cursor-pointer bg-neutral-800 group-hover:bg-[#5865f2] text-neutral-200 group-hover:text-white">{guild.name.split(" ").map(l => l.substring(0, 1)).join("")}</p>
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
                <Modal title="Create a Server" confirmLabel="Create" confirmCallback={createGuild} cancelCallback={() => {setIsOpen(false); setState(undefined)}}>
                    <ModalInputField ref={nameInput} name="Server Name" defaultValue={session.data?.user.displayname + "'s Server"} error={state?.errors?.name}/>
                </Modal>
            }
        </div>
    </>
}