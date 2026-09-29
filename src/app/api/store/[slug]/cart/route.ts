import { NextResponse } from "next/server";
import { publicCart, publicCartSummary } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){
  try{
    const {slug}=await params; const cartId=new URL(request.url).searchParams.get("cartId");
    if(!cartId) return NextResponse.json({error:"cartId is required."},{status:400});
    return NextResponse.json(await publicCartSummary(slug,cartId));
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load cart."},{status:400});}
}
export async function POST(request:Request,{params}:{params:Promise<{slug:string}>}){
  try{
    const {slug}=await params; const body=await request.json();
    const result=await publicCart(slug,body);
    return NextResponse.json(result,{status:201});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to update cart."},{status:400});}
}