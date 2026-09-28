import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { createAdminClient } from "@/lib/supabase/admin";
import { publishWebsite } from "@/server/services/publishing-service";

export const dynamic = "force-dynamic";

async function ownedSite(siteId:string,ownerId:string){
  const admin=createAdminClient();
  const {data,error}=await admin.from("build_requests").select("id,business_name,slug,published_url,live_version,status").eq("id",siteId).eq("owner_id",ownerId).maybeSingle();
  if(error)throw error;
  return data;
}

export async function GET(request:Request){
  try{
    const identity=await getFelacooIdentity();
    if(!identity)return NextResponse.json({error:"Authentication required."},{status:401});
    const siteId=new URL(request.url).searchParams.get("siteId")?.trim();
    if(!siteId)return NextResponse.json({error:"siteId is required."},{status:400});
    const site=await ownedSite(siteId,identity.felacooUserId);
    if(!site)return NextResponse.json({error:"Website project was not found."},{status:404});
    const admin=createAdminClient();
    const [{data:versions,error:versionsError},{data:websiteVersions,error:websiteVersionsError}]=await Promise.all([
      admin.from("site_versions").select("id,build_request_id,version,status,total_bytes,initial_payload_bytes,qa,files,created_at,pinned").eq("build_request_id",site.id).order("version",{ascending:false}),
      admin.from("website_versions").select("id,build_request_id,preview,label,credits_charged,created_by,created_at").eq("build_request_id",site.id).order("created_at",{ascending:false})
    ]);
    if(versionsError)throw versionsError;
    if(websiteVersionsError)throw websiteVersionsError;
    return NextResponse.json({site,versions:versions??[],websiteVersions:websiteVersions??[]});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Unable to load website versions."},{status:500});
  }
}

export async function POST(request:Request){
  try{
    const identity=await getFelacooIdentity();
    if(!identity)return NextResponse.json({error:"Authentication required."},{status:401});
    const body=await request.json() as {action?: "restore"|"pin"|"unpin";siteId?:string;versionId?:string};
    const siteId=body.siteId?.trim();
    const versionId=body.versionId?.trim();
    if(!siteId||!versionId||!body.action)return NextResponse.json({error:"siteId, versionId and action are required."},{status:400});
    const site=await ownedSite(siteId,identity.felacooUserId);
    if(!site)return NextResponse.json({error:"Website project was not found."},{status:404});
    const admin=createAdminClient();
    const {data:version,error:versionError}=await admin.from("site_versions").select("id,build_request_id,version,status,pinned").eq("id",versionId).eq("build_request_id",site.id).maybeSingle();
    if(versionError)throw versionError;
    if(!version)return NextResponse.json({error:"Version was not found."},{status:404});

    if(body.action==="pin"||body.action==="unpin"){
      const {error}=await admin.from("site_versions").update({pinned:body.action==="pin"}).eq("id",version.id);
      if(error)throw error;
      return NextResponse.json({ok:true,action:body.action,versionId:version.id});
    }

    const {data:history,error:historyError}=await admin.from("website_versions")
      .select("preview,label").eq("build_request_id",site.id).ilike("label", "%v" + version.version + "%").order("created_at",{ascending:false}).limit(1).maybeSingle();
    if(historyError)throw historyError;
    if(!history?.preview)return NextResponse.json({error:"This version has no restorable builder document."},{status:409});

    const {error:updateError}=await admin.from("build_requests").update({assembly:history.preview,preview:history.preview,status:"draft"}).eq("id",site.id).eq("owner_id",identity.felacooUserId);
    if(updateError)throw updateError;

    const published=await publishWebsite({buildRequestId:site.id,ownerId:identity.felacooUserId,slug:site.slug});
    return NextResponse.json({ok:true,action:"restore",versionId:version.id,published});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Unable to restore website version."},{status:500});
  }
}
