import { createMiddleware } from "@tanstack/react-start";
import { auth } from "./auth";
import { getWebRequest } from "vinxi/http";

export const authMiddleware = createMiddleware()
    .server(async ({ next }) => {
        const { headers } = getWebRequest()!;
        const session = await auth.api.getSession({ headers });
    
        return await next({
            context: {
                user: session?.user || null
            }
        })
    })