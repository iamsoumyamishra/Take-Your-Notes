import { NextRequest, NextResponse } from "next/server";

export default async function Proxy(req: NextRequest) {

    
    if (req.nextUrl.pathname === "/"){
        console.log(req.nextUrl.pathname)
        return NextResponse.redirect(new URL("/soumya", req.nextUrl.origin));
    }

}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|.*\\.png$).*)'
}