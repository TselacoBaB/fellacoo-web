import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

function safeNext(value: string | undefined) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const params = await searchParams;
    redirect(safeNext(params.next));
  }

  return (
    <Suspense
      fallback={
        <main className="auth-shell">
          <section className="auth-card">
            <div className="auth-loading">Loading secure sign-in…</div>
          </section>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
