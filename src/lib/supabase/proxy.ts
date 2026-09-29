import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = [
  "/login",
  "/auth/",
  "/api/auth/",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((prefix) =>
    prefix.endsWith("/") ? pathname.startsWith(prefix) : pathname === prefix
  );
}

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.redirect(new URL("/login?error=auth_config", request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const publicPath = isPublicPath(pathname);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authenticated = Boolean(user);

  if (!authenticated && !publicPath) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { authenticated: false, error: "Authentication required." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return noStore(NextResponse.redirect(loginUrl));
  }

  if (authenticated && pathname === "/login") {
    const nextPath = request.nextUrl.searchParams.get("next");
    const destination = nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/dashboard";
    return noStore(NextResponse.redirect(new URL(destination, request.url)));
  }

  if (!authenticated && publicPath) {
    return noStore(response);
  }

  return noStore(response);
}
