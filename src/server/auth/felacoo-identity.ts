import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";

export type FelacooIdentity = {
  supabaseUserId: string;
  felacooUserId: string;
};

function fallbackPasswordHash(userId: string) {
  return "$fellacoo_web$disabled$" + userId;
}

export async function ensureFelacooWebUser(): Promise<FelacooIdentity | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) return null;

  const sql = getDb();
  const name =
    typeof user.user_metadata?.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : user.email.split("@")[0] || "User";

  await sql`
    insert into public.users
      (id, name, email, password_hash, role, created_at, permissions, is_disabled, must_change_password)
    values
      (${user.id}, ${name}, ${user.email.toLowerCase()}, ${fallbackPasswordHash(user.id)}, ${"user"}, ${new Date().toISOString()}, ${JSON.stringify({})}::jsonb, false, false)
    on conflict (id) do update set
      name = excluded.name,
      email = excluded.email,
      is_disabled = false
  `;

  return {
    supabaseUserId: user.id,
    felacooUserId: user.id,
  };
}

export async function getFelacooIdentity(): Promise<FelacooIdentity | null> {
  return ensureFelacooWebUser();
}