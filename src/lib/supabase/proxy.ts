import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authenticated = Boolean(user);
  const pathname = request.nextUrl.pathname;
  const publicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth/");
  const isApi = pathname.startsWith("/api/");

  if (!authenticated && !publicPage && !isApi) {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    target.search = "";
    target.searchParams.set("next", pathname);
    response = NextResponse.redirect(target);
  }

  if (authenticated && pathname === "/login") {
    const target = request.nextUrl.clone();
    target.pathname = "/dashboard";
    target.search = "";
    response = NextResponse.redirect(target);
  }

  if (
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/builder")
  ) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}
