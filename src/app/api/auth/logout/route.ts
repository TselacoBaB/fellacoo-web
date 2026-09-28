import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function POST(){
  const supabase=await createClient();
  await supabase.auth.signOut({scope:"local"});
  return NextResponse.json({signedOut:true},{headers:{"Cache-Control":"no-store"}});
}
