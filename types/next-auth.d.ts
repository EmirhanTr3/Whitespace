import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: number
            username: string
            displayname: string
        }
    }

    interface User {
        id: number
        username: string
        displayname: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: number
        username: string
        displayname: string
    }
  }
  