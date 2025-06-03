import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChannelInfo } from '~/components'
import { getChannel } from '~/components/GuildInfo'

export const Route = createFileRoute('/app/guild/$guildId/channel/$channelId')({
    beforeLoad: async (context) => {
        const channel = await getChannel({ data: { id: context.params.channelId, guildId: context.params.guildId, skipGuildCheck: true } })
        if (!channel.success) throw redirect({ to: "/" })
        return { channel: channel.data! }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <ChannelInfo />
}
