import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

//인증된 사용자만 접근할 수 있도록 하는 미들웨어 만들기

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
};

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        } else {
            if (exists) {
                return NextResponse.redirect(new URL("/products", request.url));
            }
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
