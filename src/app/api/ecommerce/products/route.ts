import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { createProduct, listProducts } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export async function GET(request:Request){
  const identity=await getFelacooIdentity();
  if(!identity) return NextResponse.json({error:"Authentication required."},{status:401});
  const siteId=new URL(request.url).searchParams.get("siteId")?.trim();
  if(!siteId) return NextResponse.json({error:"siteId is required."},{status:400});
  try{return NextResponse.json({products:await listProducts(identity.felacooUserId,siteId)});}
  catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to load products."},{status:500});}
}

export async function POST(request:Request){
  const identity=await getFelacooIdentity();
  if(!identity) return NextResponse.json({error:"Authentication required."},{status:401});
  try{
    const body=await request.json();
    if(!body.siteId||!body.name) return NextResponse.json({error:"siteId and name are required."},{status:400});
    const product=await createProduct(identity.felacooUserId,body);
    return NextResponse.json({product},{status:201});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to create product."},{status:500});}
}