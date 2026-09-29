import { NextResponse } from "next/server";
import { listPublicProducts } from "@/server/services/ecommerce-service";

export const dynamic="force-dynamic";

export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){
  try{
    const {slug}=await params;
    return NextResponse.json(await listPublicProducts(slug));
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Store not found."},{status:404});
  }
}