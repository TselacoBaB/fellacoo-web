import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
function safeNext(value:string|null){return !value||!value.startsWith("/")||value.startsWith("//")?"/dashboard":value;}
export async function GET(request:Request){
  const url=new URL(request.url); const code=url.searchParams.get("code"); const next=safeNext(url.searchParams.get("next"));
  if(!code) return NextResponse.redirect(new URL("/login?error=missing_callback_code",url.origin));
  const supabase=await createClient(); const {error}=await supabase.auth.exchangeCodeForSession(code);
  if(error) return NextResponse.redirect(new URL("/login?error=callback_failed",url.origin));
  const response=NextResponse.redirect(new URL(next,url.origin)); response.headers.set("Cache-Control","no-store"); return response;
}
