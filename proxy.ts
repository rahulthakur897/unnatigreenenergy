import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "uge_session";

/**
 * Optimistic route protection: visitors without a session cookie are sent to the sign-in page.
 * The session itself is verified against the database in every dashboard layout, page,
 * server action and API route (see server/auth/dal.ts).
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/login/";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/api/billing/:path*"],
};
