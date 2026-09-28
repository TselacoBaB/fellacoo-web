import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type FelacooIdentity = {
  supabaseUserId: string;
  felacooUserId: string;
};

export async function getFelacooIdentity(): Promise<FelacooIdentity | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  const admin = createAdminClient();
  const { data: link, error: linkError } = await admin
    .from("felacoo_auth_links")
    .select("user_id")
    .eq("supabase_user_id", user.id)
    .maybeSingle();

  if (linkError || !link) return null;

  return {
    supabaseUserId: user.id,
    felacooUserId: String(link.user_id)
  };
}
