import { createClient } from "@/lib/supabase/server";

export type AuthenticatedFelacooAccount = {
  supabaseUserId: string;
  felacooUserId: string;
  name: string;
  email: string;
};

function getAccountFromUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): AuthenticatedFelacooAccount {
  const email = user.email ?? "";
  const metadata = user.user_metadata ?? {};
  const name =
    typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : email.split("@")[0] || "User";

  return {
    supabaseUserId: user.id,
    felacooUserId: user.id,
    name,
    email,
  };
}

export async function getCurrentFelacooAccount(): Promise<AuthenticatedFelacooAccount | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return getAccountFromUser(user);
}

export async function signInFelacoo(
  email: string,
  password: string,
): Promise<AuthenticatedFelacooAccount> {
  const normalized = email.trim().toLowerCase();

  if (!normalized || !password) {
    throw new Error("Email and password are required.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (error || !data.user) {
    console.error("[auth/login] Supabase authentication failed:", {
      status: error?.status ?? null,
      message: error?.message ?? "No authenticated user returned.",
    });

    throw new Error("Invalid email or password.");
  }

  return getAccountFromUser(data.user);
}
