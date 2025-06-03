import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import globalCss from "~/styles/globals.css?url";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Whitespace',
            },
        ],
        links: [
            { rel: 'stylesheet', href: globalCss, suppressHydrationWarning: true }
        ]
    }),
    component: RootComponent
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body className="h-full bg-neutral-800 flex flex-row">
                {children}
                <Scripts />
                <TanStackRouterDevtools position="bottom-right"/>
            </body>
        </html>
    )
}