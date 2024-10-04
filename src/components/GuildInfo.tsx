import { Guild } from "@/lib/prisma"
import { Modal, ModalInputField } from "."
import { createRef, useState } from "react"
import { CreateChannelFormSchema, FormState } from "@/lib/definitions"
import Link from "next/link"

export default function GuildInfo({ guild }: { guild: Guild }) {
    const [ isOpen, setIsOpen ] = useState(false)
    const nameInput = createRef<HTMLInputElement>()
    const [ state, setState ] = useState<FormState>()

    async function createChannel() {
        const validatedFields = CreateChannelFormSchema.safeParse({
            name: nameInput.current!.value
        })
        if (!validatedFields.success) {
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        }

        setIsOpen(false)
        setState(undefined)
        
        const response = await fetch("/api/channels", {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput.current!.value,
                guildId: guild.id
            }),
            headers: { "Content-Type": "application/json" }
        })

        console.log(response)
    }

    console.log(guild)
    return <div className="basis-60 shrink-0 bg-[#212121] flex flex-col">
        <div className="h-12 pl-4 pr-3 py-3 border-b border-neutral-900 flex flex-row justify-between items-center">
            <p className="text-stone-200">{guild.name}</p>
            <div onClick={() => setIsOpen(true)} className="group w-5 h-5 flex items-center justify-center cursor-pointer">
                <svg className="group-hover:w-5 group-hover:h-5 transition-all ease-in-out duration-50" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>
            </div>
            {isOpen &&
                <Modal title="Create a Channel" confirmLabel="Create" confirmCallback={() => createChannel()} cancelCallback={() => {setIsOpen(false); setState(undefined)}}>
                    <ModalInputField ref={nameInput} name="Channel Name" error={state?.errors?.name} />
                </Modal>
            }
        </div>
        <div className="flex flex-col p-2 overflow-y-auto h-full">
            {guild.channels && guild.channels.map(channel =>
                <Link key={channel.id} href={"/channel/" + channel.id}>
                    <div className="group px-2 py-1 h-8 items-center flex flex-row gap-1 hover:bg-white hover:bg-opacity-5 hover:rounded-[5px] cursor-pointer">
                        <img src="/assets/text.png" className="w-6 h-6"/>
                        <p className="text-gray-400 group-hover:text-gray-300">{channel.name}</p>
                    </div>
                </Link>
            )}
        </div>
    </div>
}