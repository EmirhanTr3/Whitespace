import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from 'vinxi/http'
import { auth } from '~/lib/auth'

const getUser = createServerFn()
    .handler(async () => {
        const { headers } = getWebRequest()!;
        const session = await auth.api.getSession({ headers });
    
        return session?.user || null;
    })

export const Route = createFileRoute('/_auth')({
    beforeLoad: async () => {
        const session = await getUser()
        if (session) throw redirect({ to: "/" })
    }
})
