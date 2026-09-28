import { NextResponse } from "next/server";
import { signInFelacoo } from "@/server/auth/felacoo-auth";
export const dynamic="force-dynamic";
export const runtime="nodejs";
export async function POST(request:Request){
  try{
    const body=await request.json();
    const email=typeof body?.email==="string"?body.email:"";
    const password=typeof body?.password==="string"?body.password:"";
    const account=await signInFelacoo(email,password);
    return NextResponse.json({authenticated:true,user:{id:account.felacooUserId,email:account.email,name:account.name}},{headers:{"Cache-Control":"private, no-store, max-age=0, must-revalidate"}});
  }catch(error){
    console.error("[auth/login]",error);
    return NextResponse.json({authenticated:false,error:error instanceof Error?error.message:"Unable to sign in."},{status:401,headers:{"Cache-Control":"no-store"}});
  }
}
