import { GuildBar, GuildInfo } from "@/components";
import type { Guild } from "@/lib/prisma";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Guild() {
    const router = useRouter()
    const [ guild, setGuild ] = useState<Guild>()

    useEffect(() => {
        async function getGuild() {
            const id = parseInt(router.query.guildId as string)
            if (!id) return;

            if (!guild || guild.id != id) {
                const guild = await (await fetch(`/api/guilds?id=${id}`)).json()

                if (guild.id) {
                    setGuild(guild)
                } else {
                    router.push("/")
                }
            }
        }
        getGuild()
    })

    return <>
        <GuildBar />
        {guild && <GuildInfo guild={guild} />}
    </>
}