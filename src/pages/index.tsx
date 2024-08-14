import Head from "next/head";
import { Roboto } from "next/font/google";

const inter = Roboto({ subsets: ["latin"], weight: "400" });

export default function Home() {
    return <>
        <Head>
            <title>Whitespace</title>
            <meta name="description" content="chat app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={inter.className}>
            <p>sex</p>
        </main>
    </>
}
