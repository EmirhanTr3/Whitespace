import { SocketProvider } from "@/components";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import Head from "next/head";

const inter = Roboto({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }: AppProps) {
    return <>
        <Head>
            <title>Whitespace</title>
            <meta name="description" content="chat app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <SessionProvider session={pageProps.session}>
            <SocketProvider>
                <main className={inter.className + " h-full bg-neutral-800 flex flex-row"}>
                    <Component {...pageProps} />
                </main>
            </SocketProvider>
        </SessionProvider>
    </>
}
