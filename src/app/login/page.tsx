import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

export const dynamic="force-dynamic";

export default async function LoginPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(user) {
    const next = typeof (await import("next/headers")).headers === "function" ? null : null;
    redirect("/dashboard");
  }
  return <Suspense fallback={<main className="auth-shell"><section className="auth-card"><div className="auth-loading">Loading secure sign-in…</div></section></main>}><LoginForm /></Suspense>;
}
