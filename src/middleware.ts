import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
    const session = await getToken({req: request, secret: process.env.SECRET})
    if (!session) return NextResponse.redirect(new URL("/login", request.url))

    const response = await (await fetch(new URL("/api/auth/validateUser", request.url), {
        method: "POST",
        body: JSON.stringify({
            id: session?.id
        }),
        headers: { "Content-Type": "application/json" }
    })).json()

    if (response.status != true) return NextResponse.redirect(new URL("/login", request.url))
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       * - login/register
       */
      '/((?!api|login|register|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
  }