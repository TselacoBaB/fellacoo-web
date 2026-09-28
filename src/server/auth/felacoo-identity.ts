import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";

export type FelacooIdentity = {
  supabaseUserId: string;
  felacooUserId: string;
};

export async function getFelacooIdentity(): Promise<FelacooIdentity | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  const sql = getDb();
  const rows = await sql<{ user_id: string }[]>`
    select user_id
    from public.felacoo_auth_links
    where supabase_user_id = ${user.id}
    limit 1
  `;

  const link = rows[0];
  if (!link) return null;

  return {
    supabaseUserId: user.id,
    felacooUserId: String(link.user_id),
  };
};
