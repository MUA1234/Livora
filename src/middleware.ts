import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
    "/",
    "/user-panel/login",
    "/user-panel/register",
    "/admin/login",
    "/forgot-password",
    "/reset-password",
    "/user-panel/furniture-catalogue",
    "/user-panel/consultation-request",
    "/consultation-request",
];

function isPublicRoute(pathname: string): boolean {
    // Exact matches
    if (PUBLIC_ROUTES.includes(pathname)) return true;

    // Preview links are public (token-based auth)
    if (pathname.startsWith("/preview/")) return true;

    // Furniture detail pages are publicly browsable
    if (pathname.startsWith("/user-panel/furniture-details/")) return true;

    // Static assets, API routes, Next internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/images") ||
        pathname.includes(".")
    ) {
        return true;
    }

    return false;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("livora-token")?.value;

    // Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Protected user routes — require any valid token
    if (pathname.startsWith("/user-panel/")) {
        if (!token) {
            const loginUrl = new URL("/user-panel/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // Protected admin routes — require token (role check happens client-side via API 403)
    if (pathname.startsWith("/admin/") || pathname === "/dashboard") {
        if (!token) {
            const loginUrl = new URL("/admin/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except static files and Next.js internals.
         * This ensures middleware runs on page navigations but not on
         * images, fonts, etc.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)).*)",
    ],
};
