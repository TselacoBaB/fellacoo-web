"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type FelacooAccount = {
  id: string;
  supabaseUserId: string;
  email: string;
  name: string;
};

type AuthState = {
  user: User | null;
  felacooUser: FelacooAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthStateContext = createContext<AuthState | null>(null);

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [felacooUser, setFelacooUser] = useState<FelacooAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const loadAccount = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        setFelacooUser(null);
        return;
      }

      const payload = await response.json();
      setFelacooUser(payload.user ?? null);
    } catch {
      setFelacooUser(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser ?? null);

      if (currentUser) {
        await loadAccount();
      } else {
        setFelacooUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadAccount, supabase]);

  useEffect(() => {
    let active = true;

    void refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!active) return;

        const nextUser = session?.user ?? null;
        setUser(nextUser);

        if (nextUser) {
          await loadAccount();
        } else {
          setFelacooUser(null);
        }

        if (event === "SIGNED_OUT") {
          router.replace("/login?loggedOut=1");
          router.refresh();
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadAccount, refresh, router, supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut({ scope: "local" });
    await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
      credentials: "include",
    }).catch(() => undefined);

    setUser(null);
    setFelacooUser(null);
    router.replace("/login?loggedOut=1");
    router.refresh();
  }, [router, supabase]);

  const value = useMemo(
    () => ({
      user,
      felacooUser,
      isAuthenticated: Boolean(user && felacooUser),
      isLoading,
      refresh,
      signOut,
    }),
    [user, felacooUser, isLoading, refresh, signOut]
  );

  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error("useAuth must be used inside AuthStateProvider");
  return context;
}
