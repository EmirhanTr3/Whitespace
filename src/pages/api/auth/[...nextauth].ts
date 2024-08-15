import NextAuth, { AuthOptions } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { hash } from "crypto"
import { LoginFormSchema } from "@/lib/definitions"

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
            /** @ts-ignore */
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
                    return {...user, name: user.displayname}
                }
                return null
            }
        })
    ],
    callbacks: {
        session: async ({ session, user }) => {
            return session
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
}

export default NextAuth(authOptions)