import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDb } from "@/lib/db";

const LEGACY_API_URL = (process.env.FELACOO_LEGACY_API_URL || "https://api.fellacoo.xyz").replace(/\/$/, "");

export type AuthenticatedFelacooAccount = {
  supabaseUserId: string;
  felacooUserId: string;
  name: string;
  email: string;
};

async function getFelacooUser(email: string) {
  const sql = getDb();
  const rows = await sql.unsafe(
    "select id,name,email,is_disabled from public.users where lower(email)=lower($1) limit 1",
    [email]
  ) as { id:string; name:string; email:string; is_disabled:boolean }[];
  return rows[0] ?? null;
}

async function ensureAuthLink(supabaseUserId:string, felacooUserId:string) {
  const sql=getDb();
  await sql.unsafe(
    "insert into public.felacoo_auth_links (supabase_user_id,user_id,created_at) values ($1,$2,$3) on conflict (supabase_user_id) do update set user_id=excluded.user_id",
    [supabaseUserId,felacooUserId,new Date().toISOString()]
  );
}

async function findSupabaseUser(email:string) {
  const admin=createAdminClient();
  const {data,error}=await admin.auth.admin.listUsers({page:1,perPage:1000});
  if(error) throw error;
  return data.users.find(user=>user.email?.toLowerCase()===email.toLowerCase()) ?? null;
}

async function verifyLegacyCredentials(email: string, password: string) {
  const response = await fetch(`${LEGACY_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (response.ok) {
    return {
      ok: true as const,
      status: response.status,
      user: payload,
    };
  }

  const detail =
    typeof payload?.detail === "string"
      ? payload.detail
      : typeof payload?.error === "string"
        ? payload.error
        : "Legacy authentication request failed.";

  return {
    ok: false as const,
    status: response.status,
    detail,
  };
}

export async function getCurrentFelacooAccount(): Promise<AuthenticatedFelacooAccount | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const sql = getDb();
  const rows = await sql.unsafe(
    "select u.id,u.name,u.email,u.is_disabled from public.users u join public.felacoo_auth_links l on l.user_id=u.id where l.supabase_user_id=$1 limit 1",
    [user.id]
  ) as { id:string; name:string; email:string; is_disabled:boolean }[];

  const account = rows[0];
  if (!account || account.is_disabled) return null;

  return {
    supabaseUserId: user.id,
    felacooUserId: String(account.id),
    name: account.name,
    email: account.email,
  };
}

export async function signInFelacoo(email:string,password:string):Promise<AuthenticatedFelacooAccount> {
  const normalized=email.trim().toLowerCase();
  if(!normalized || !password) throw new Error("Email and password are required.");
  const felacooUser=await getFelacooUser(normalized);
  if(!felacooUser || felacooUser.is_disabled) throw new Error("Invalid email or password.");

  const supabase=await createClient();
  let {data:signedIn,error:signInError}=await supabase.auth.signInWithPassword({email:normalized,password});

  if(signInError || !signedIn.user) {
    const legacyResult = await verifyLegacyCredentials(normalized, password);

    if (!legacyResult.ok) {
      console.error("[auth/login] Legacy authentication failed:", {
        status: legacyResult.status,
        detail: legacyResult.detail,
      });

      if (legacyResult.status === 429) {
        throw new Error(legacyResult.detail);
      }

      if (legacyResult.status >= 500) {
        throw new Error(
          "The existing Fellacoo authentication service is temporarily unavailable."
        );
      }

      throw new Error("Invalid email or password.");
    }

    const admin=createAdminClient();
    let authUser=await findSupabaseUser(normalized);
    if(!authUser) {
      const created=await admin.auth.admin.createUser({
        email:normalized,password,email_confirm:true,
        user_metadata:{name:felacooUser.name,felacoo_user_id:felacooUser.id},
      });
      if(created.error || !created.user) throw new Error("Unable to create the secure sign-in account.");
      authUser=created.user;
    } else {
      const updated=await admin.auth.admin.updateUserById(authUser.id,{
        password,email_confirm:true,
        user_metadata:{...(authUser.user_metadata||{}),name:felacooUser.name,felacoo_user_id:felacooUser.id},
      });
      if(updated.error) throw updated.error;
    }
    const retry=await supabase.auth.signInWithPassword({email:normalized,password});
    if(retry.error || !retry.data.user) throw new Error("Your account was verified, but the secure session could not be created.");
    signedIn=retry.data;
  }

  await ensureAuthLink(signedIn.user.id,felacooUser.id);
  return {supabaseUserId:signedIn.user.id,felacooUserId:felacooUser.id,name:felacooUser.name,email:felacooUser.email};
}
