import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function POST(request:Request){
  try{
    const body=await request.json();
    const email=typeof body?.email==="string"?body.email.trim().toLowerCase():"";
    if(!email) return NextResponse.json({error:"Enter your email address."},{status:400});
    const supabase=await createClient();
    const origin=new URL(request.url).origin;
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:origin+"/auth/callback?next=/auth/reset-password"});
    if(error) throw error;
    return NextResponse.json({sent:true,message:"If an account exists for that email, a password reset link has been sent."},{headers:{"Cache-Control":"no-store"}});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Unable to send the reset email."},{status:400,headers:{"Cache-Control":"no-store"}});
  }
}
