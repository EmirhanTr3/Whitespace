import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { GuildInfo } from '~/components'
import { getGuild } from '~/components/GuildList'

export const Route = createFileRoute('/app/guild/$guildId')({
    beforeLoad: async (context) => {
        const guild = await getGuild({ data: { id: context.params.guildId } })
        if (!guild.success) throw redirect({ to: "/" })
        return { guild: guild.data! }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <div className="grow-1 flex flex-row">
        <GuildInfo />
        <Outlet />
    </div>
}
