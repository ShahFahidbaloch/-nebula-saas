import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const auth = request.headers.get("authorization") ?? "";
    const unauthorized = new NextResponse(null, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Nebula Admin"' },
    });

    if (!auth.startsWith("Basic ")) return unauthorized;

    let decoded: string;
    try {
      decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
    } catch {
      return unauthorized;
    }

    const colon = decoded.indexOf(":");
    const username = decoded.slice(0, colon);
    const password = decoded.slice(colon + 1);

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return unauthorized;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
