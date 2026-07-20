import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Don't redirect if already on the sign-in page
  if (pathname.startsWith("/auth/sign-in")) {
    return NextResponse.next();
  }
  
  // Bypass API routes and static files
  if (
    pathname.startsWith("/api") || 
    pathname.startsWith("/_next") || 
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Fetch session from better-auth API
  const url = new URL("/api/auth/get-session", req.url);
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      const loginUrl = new URL("/auth/sign-in", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Optionally check for super-admin if needed by decoding session,
    // but a basic authenticated check works for now.
    return NextResponse.next();
  } catch (error) {
    // If fetch fails, default to redirecting to sign in
    const loginUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
