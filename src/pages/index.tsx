import Head from "next/head";
import { Roboto } from "next/font/google";
import { getSession, useSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import Dialogs from "@/components/dialogs";
import { useState } from "react";

const inter = Roboto({ subsets: ["latin"], weight: "400" });

export default function Home() {
    const [isOpen, setIsOpen] = useState(false)
    const session = useSession()

    async function click() {
        const response = await fetch("/api/guilds", {
            method: 'POST',
            body: JSON.stringify({
                name: "test",
                ownerId: 1
            }),
            headers: { "Content-Type": "application/json" }
        })

        console.log(response)
    }

    return <>
        <Head>
            <title>Whitespace</title>
            <meta name="description" content="chat app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={inter.className + " h-full bg-neutral-800 flex flex-row"}>
            <div className="bg-neutral-900 w-[70px]">
                <button onClick={() => click()}>create guild</button>
            </div>
            <Dialogs isOpen={isOpen} setIsOpen={setIsOpen} />
            {/* <p>Whitespace</p>
            {session.data && <p>{ session.data.user?.name } love Whitespace</p>}
            <Link href="api/auth/signout">Login</Link> */}
        </main>
    </>
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)

    if (!session) { 
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}