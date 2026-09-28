import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
export const dynamic="force-dynamic";
export default async function LoginPage(){
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
  if(user) redirect("/dashboard");
  return <LoginForm />;
}
