import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Rank } from "@prisma/client";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        generateId: false,
        ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false
		}
    },

    user: {
        additionalFields: {
            displayname: {
                type: "string",
                required: true
            },
            rank: {
                type: "string",
                required: true,
                defaultValue: Rank.USER
            },
            badges: {
                type: "string[]",
                required: true,
                defaultValue: []
            },
            avatar: {
                type: "string",
                required: false
            }
        },
    }
})