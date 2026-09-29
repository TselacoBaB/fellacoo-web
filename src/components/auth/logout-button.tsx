"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [busy, setBusy] = useState(false);

  async function logout() {
    if (busy) return;
    setBusy(true);

    try {
      // Server-first logout clears the SSR auth cookies before the browser navigates.
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to sign out securely.");
      }

      // The server is the source of truth for SSR auth. Clear the browser session too.
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to sign out.");
      setBusy(false);
      return;
    }

    // Hard navigation prevents an authenticated dashboard route from being reused
    // from the Next.js client router cache after logout.
    window.location.replace("/");
  }

  return (
    <button
      type="button"
      className={compact ? "auth-logout compact" : "auth-logout"}
      onClick={() => void logout()}
      disabled={busy}
    >
      {busy ? <Loader2 size={15} className="spin" /> : <LogOut size={15} />}
      {!compact && <span>{busy ? "Signing out…" : "Sign out"}</span>}
    </button>
  );
}
