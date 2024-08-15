import Head from "next/head";
import { Roboto } from "next/font/google";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";

const inter = Roboto({ subsets: ["latin"], weight: "400" });

export default function Home() {
    const session = useSession();

    return <>
        <Head>
            <title>Whitespace</title>
            <meta name="description" content="chat app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={inter.className}>
            <p>Whitespace</p>
            {session.data && <p>{ session.data.user?.name } love Whitespace</p>}
            <Link href="api/auth/signout">Login</Link>
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