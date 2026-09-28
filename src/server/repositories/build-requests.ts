import { createClient } from "@/lib/supabase/server";

export async function getBuildRequest(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("build_requests")
    .select("id,business_name,activity,location,status,preview,owner_id,created_at,slug,published_url")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}