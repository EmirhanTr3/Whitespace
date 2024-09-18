import Head from "next/head";
import { Roboto } from "next/font/google";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { Guild } from "@prisma/client";

const inter = Roboto({ subsets: ["latin"], weight: "400" });

export default function Home() {
    const [ guilds, setGuilds ] = useState<Guild[] | null>(null)

    async function click() {
        const response = await fetch("/api/guilds", {
            method: 'POST',
            body: JSON.stringify({
                name: "test"
            }),
            headers: { "Content-Type": "application/json" }
        })

        console.log(response)
    }

    useEffect(() => {
        async function fetchData() {
            if (!guilds) {
                const guilds = await (await fetch("/api/guilds")).json()
                setGuilds(guilds)
            }
        }

        fetchData()
    })

    return <>
        <Head>
            <title>Whitespace</title>
            <meta name="description" content="chat app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={inter.className + " h-full bg-neutral-800 flex flex-row"}>
            <div className="bg-neutral-900 w-[72px] py-3 flex flex-col items-center gap-2 overflow-y-auto">
                {guilds && guilds.map(guild =>
                    <div key={guild.id} className="w-[48px] h-[48px] group">
                        <div className="w-[4px] h-[48px] absolute left-0 flex items-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 bg-white w-full h-[20px] rounded-r-md"/>
                        </div>
                        {guild.icon ?
                            <img className="transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] hover:rounded-2xl duration-300 cursor-pointer" src={guild.icon} /> :
                            <p className="flex items-center justify-center transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] hover:rounded-2xl duration-300 cursor-pointer bg-neutral-800 hover:bg-[#5865f2] text-neutral-200 hover:text-white">{guild.name.split(" ").map(l => l.substring(0, 1)).join("")}</p>
                        }
                    </div>
                )}
                <div className="w-[48px] h-[48px]">
                    <button onClick={click} className="group flex items-center justify-center transition-all ease-in-out w-[48px] h-[48px] rounded-[50%] hover:rounded-2xl duration-300 cursor-pointer bg-neutral-800 hover:bg-[#23a559]">
                        <svg className="transition-all ease-in-out duration-300 group-hover:fill-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#23a559" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
                    </button>
                </div>
            </div>
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