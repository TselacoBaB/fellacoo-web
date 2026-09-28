import { NextResponse } from "next/server";
import { getCurrentFelacooAccount } from "@/server/auth/felacoo-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const account = await getCurrentFelacooAccount();

    if (!account) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401, headers: { "Cache-Control": "private, no-store, max-age=0, must-revalidate" } }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: account.felacooUserId,
          supabaseUserId: account.supabaseUserId,
          email: account.email,
          name: account.name,
        },
      },
      { headers: { "Cache-Control": "private, no-store, max-age=0, must-revalidate" } }
    );
  } catch (error) {
    console.error("[auth/me]", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401, headers: { "Cache-Control": "private, no-store, max-age=0, must-revalidate" } }
    );
  }
}
