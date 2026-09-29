import { NextResponse } from "next/server";
import { publicCheckout } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export async function POST(request:Request,{params}:{params:Promise<{slug:string}>}){
  try{
    const {slug}=await params; const body=await request.json();
    if(!body.cartId||!body.idempotencyKey) return NextResponse.json({error:"cartId and idempotencyKey are required."},{status:400});
    return NextResponse.json({order:await publicCheckout(slug,body)});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to create order."},{status:400});}
}