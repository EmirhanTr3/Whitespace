import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/pages/lib/prisma"

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                const res = await fetch(process.env.NEXTAUTH_URL + "/api/auth/validate", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()

                if (res.ok && user) {
                    return user
                }
                return null
            }
        })
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
}

export default NextAuth(authOptions)