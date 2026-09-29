import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { createOrderFromCart } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export async function POST(request:Request){
  const identity=await getFelacooIdentity();
  if(!identity) return NextResponse.json({error:"Authentication required."},{status:401});
  try{
    const body=await request.json();
    if(!body.cartId||!body.idempotencyKey) return NextResponse.json({error:"cartId and idempotencyKey are required."},{status:400});
    const order=await createOrderFromCart(identity.felacooUserId,body);
    return NextResponse.json({order});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to create checkout order."},{status:400});}
}