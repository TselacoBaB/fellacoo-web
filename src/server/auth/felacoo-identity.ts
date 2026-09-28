import { createClient } from "@/lib/supabase/server";

export type FelacooIdentity = {
  supabaseUserId: string;
  felacooUserId: string;
};

export async function getFelacooIdentity(): Promise<FelacooIdentity | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    supabaseUserId: user.id,
    felacooUserId: user.id,
  };
}
