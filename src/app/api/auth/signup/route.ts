import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Use at least 8 characters for your password." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const origin = new URL(request.url).origin;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("[auth/signup]", {
        status: error.status ?? null,
        message: error.message,
      });
      return NextResponse.json(
        { error: error.message },
        { status: error.status && error.status >= 400 ? error.status : 400 }
      );
    }

    const requiresEmailConfirmation = !data.session;

    return NextResponse.json(
      {
        created: true,
        authenticated: Boolean(data.session),
        requiresEmailConfirmation,
        message: requiresEmailConfirmation
          ? "Account created. Check your email to confirm your account, then sign in."
          : "Account created. Opening your workspace…",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[auth/signup]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create your account." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
