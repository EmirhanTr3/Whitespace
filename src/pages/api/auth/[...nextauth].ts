import NextAuth, { AuthOptions, DefaultSession } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { hash, randomBytes } from "crypto"
import { LoginFormSchema } from "@/lib/definitions"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
   interface JWT {
       id: string
       name: string
       email: string
    } 
}

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt", // Enable JWT sessions
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 1 day
        generateSessionToken: () => randomBytes(32).toString("hex"), // Generate a secure JWT token
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
        // @ts-ignore
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
            return { ...user }
            }
            return null
        }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                // token.name = user.name;
                // token.email = user.email;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) { // Check if token exists before accessing its properties
                session.user.id = token.id;
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)