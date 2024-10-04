import { GuildBar, GuildInfo, ChannelInfo } from "@/components";
import type { Channel, Guild } from "@/lib/prisma";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Channel() {
    const router = useRouter()
    const [ guild, setGuild ] = useState<Guild>()
    const [ channel, setChannel ] = useState<Channel>()

    useEffect(() => {
        async function fetchData() {
            const id = parseInt(router.query.channelId as string)
            if (!id) return;

            if (!channel || channel.id != id) {
                const channel = await (await fetch(`/api/channels?id=${id}`)).json()
                const guild = await (await fetch(`/api/guilds?id=${channel.guildId}`)).json()

                if (channel.id) {
                    setChannel(channel)
                    setGuild(guild)
                } else {
                    router.push("/")
                }
            }
        }
        fetchData()
    })

    return <>
        <GuildBar />
        {guild && <GuildInfo guild={guild} />}
        {channel && <ChannelInfo channel={channel} />}
    </>
}