import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { hash } from "crypto"
import { LoginFormSchema } from "@/lib/definitions"
import { redirect } from "next/navigation"

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
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                const validatedFields = LoginFormSchema.safeParse({
                    email: credentials.email,
                    password: credentials.password
                })
                if (!validatedFields.success) return null;

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email,
                        password: hash("sha256", credentials?.password)
                    }
                })

                if (user) {
                    return {
                        id: user.id,
                        username: user.username,
                        displayname: user.displayname
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) {
                token.id = typeof user.id == "number" ? user.id : parseInt(user.id)
                token.username = user.username
                token.displayname = user.displayname
            }
            return token
        },
        // @ts-ignore
        session: async ({ session, token }) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: token.id
                }
            })
            if (!user) return {}

            return {
                ...session,
                user: {
                    id: token.id,
                    username: token.username,
                    displayname: token.displayname
                }
            }
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
}

export default NextAuth(authOptions)