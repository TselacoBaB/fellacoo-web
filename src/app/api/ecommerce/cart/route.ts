import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { addToCart, getCartSummary } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export async function GET(request:Request){
  const identity=await getFelacooIdentity();
  if(!identity) return NextResponse.json({error:"Authentication required."},{status:401});
  const id=new URL(request.url).searchParams.get("cartId")?.trim();
  if(!id) return NextResponse.json({error:"cartId is required."},{status:400});
  try{return NextResponse.json(await getCartSummary(identity.felacooUserId,id));}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load cart."},{status:400});}
}
export async function POST(request:Request){
  const identity=await getFelacooIdentity();
  if(!identity) return NextResponse.json({error:"Authentication required."},{status:401});
  try{
    const body=await request.json();
    const result=await addToCart(identity.felacooUserId,body);
    return NextResponse.json(result,{status:201});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to update cart."},{status:400});}
}