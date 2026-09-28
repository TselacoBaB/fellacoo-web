import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { starterTemplates } from "@/components/builder/starter-templates";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const sql = getDb();
    const params = new URL(request.url).searchParams;
    const q = params.get("q")?.trim().toLowerCase() || "";
    const category = params.get("category")?.trim().toLowerCase() || "";
    const rows = await sql.unsafe<any[]>("select id,name,description,source_type,status,style_label,primary_categories,secondary_categories,universal,stats,current_version,created_at,updated_at from public.templates where status <> $1 order by usage_count desc, updated_at desc limit 100", ["ARCHIVED"]);
    const builtIns = starterTemplates.map((t) => ({ id:t.id,name:t.name,description:t.description,source_type:"STARTER",status:"PUBLISHED",style_label:t.style,primary_categories:[t.category],secondary_categories:[t.audience],universal:false,stats:{audience:t.audience},current_version:1,created_at:null,updated_at:null,featured:Boolean(t.featured),document:t.document }));
    const dbTemplates = rows.map((row) => ({ ...row, featured:Boolean(row.stats?.featured) }));
    const templates = [...builtIns, ...dbTemplates].filter((template) => {
      const haystack = [template.name,template.description,template.style_label,...(template.primary_categories || []),...(template.secondary_categories || [])].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (!category || String(template.primary_categories?.[0] || "").toLowerCase() === category);
    });
    return NextResponse.json({ templates, categories:Array.from(new Set(templates.flatMap((t) => t.primary_categories || []))).sort() });
  } catch (error) {
    return NextResponse.json({ error:error instanceof Error ? error.message : "Unable to load template library." }, { status:500 });
  }
}

export async function POST(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) return NextResponse.json({ error:"Authentication required." }, { status:401 });
    const body = await request.json() as { templateId?:string; businessName?:string };
    const templateId = body.templateId?.trim();
    if (!templateId) return NextResponse.json({ error:"templateId is required." }, { status:400 });
    const starter = starterTemplates.find((template) => template.id === templateId);
    const sql = getDb();
    let document = starter?.document ?? null;
    let templateName = starter?.name ?? "Website Template";
    if (!document) {
      const rows = await sql.unsafe<any[]>("select t.id,t.name,t.design_tokens,tv.snapshot from public.templates t left join lateral (select snapshot from public.template_versions where template_id=t.id order by version desc limit 1) tv on true where t.id=$1 and t.status <> $2 limit 1", [templateId,"ARCHIVED"]);
      const row = rows[0];
      if (!row) return NextResponse.json({ error:"Template was not found." }, { status:404 });
      document = row.snapshot?.document ?? row.design_tokens?.document ?? null;
      templateName = row.name;
    }
    if (!document) return NextResponse.json({ error:"This template does not contain a builder document yet." }, { status:422 });
    const id = crypto.randomUUID();
    const name = body.businessName?.trim() || templateName;
    const documentJson = JSON.stringify(document);
    await sql.unsafe("insert into public.build_requests (id,business_name,activity,location,status,owner_id,created_at,assembly,preview,published_bytes,live_version) values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$8::jsonb,$9,$10)", [id,name,"Website","Online","draft",identity.felacooUserId,new Date().toISOString(),documentJson,0,0]);
    return NextResponse.json({ ok:true,buildRequestId:id,url:"/builder/"+id,templateName });
  } catch (error) {
    return NextResponse.json({ error:error instanceof Error ? error.message : "Unable to use template." }, { status:500 });
  }
}
