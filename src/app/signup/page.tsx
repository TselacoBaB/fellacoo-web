"use client";

import { FormEvent, useState } from "react";
import { Loader2, LockKeyhole, Mail, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create your account.");
      }

      if (payload.authenticated) {
        window.location.replace("/dashboard");
        return;
      }

      setMessage(payload.message || "Account created. Check your email to continue.");
      setBusy(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark"><i/><i/><i/></span>
          <strong>FELLACOO</strong>
        </div>

        <div className="auth-heading">
          <span className="auth-icon"><ShieldCheck size={22}/></span>
          <div>
            <p>NEW WORKSPACE</p>
            <h1>Create your account.</h1>
          </div>
        </div>

        <p className="auth-subtitle">
          Create your new Fellacoo Web workspace and start building.
        </p>

        {error && <div className="auth-alert error">{error}</div>}
        {message && <div className="auth-alert success">{message}</div>}

        {!message && (
          <form onSubmit={submit} className="auth-form">
            <label>
              Your name
              <span className="auth-input-wrap">
                <User size={17}/>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </span>
            </label>

            <label>
              Email address
              <span className="auth-input-wrap">
                <Mail size={17}/>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </span>
            </label>

            <label>
              Password
              <span className="auth-input-wrap">
                <LockKeyhole size={17}/>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </span>
            </label>

            <label>
              Confirm password
              <span className="auth-input-wrap">
                <LockKeyhole size={17}/>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={e => setConfirmation(e.target.value)}
                  placeholder="Repeat your password"
                  required
                />
              </span>
            </label>

            <button type="submit" className="auth-submit" disabled={busy}>
              {busy ? <><Loader2 size={18} className="spin"/> Creating account…</> : "Create Fellacoo account"}
            </button>
          </form>
        )}

        <div className="auth-security-note">
          <LockKeyhole size={14}/>
          <span>Your account is secured by Supabase Auth.</span>
        </div>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <Link href="/login">Already have an account? Sign in</Link>
        </div>
      </section>
    </main>
  );
}
