"use client";
import { FormEvent,useEffect,useState } from "react";
import { Loader2,LockKeyhole,ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
export default function ResetPasswordPage(){
  const [password,setPassword]=useState(""); const [confirmation,setConfirmation]=useState(""); const [busy,setBusy]=useState(false); const [ready,setReady]=useState(false); const [error,setError]=useState("");
  useEffect(()=>{const supabase=createClient(); void supabase.auth.getUser().then(({data:{user}})=>{if(user)setReady(true);else setError("This password reset link is invalid or has expired.");});},[]);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(password.length<8){setError("Use at least 8 characters for your new password.");return;}
    if(password!==confirmation){setError("The passwords do not match.");return;}
    setBusy(true);setError("");
    const supabase=createClient(); const {error:updateError}=await supabase.auth.updateUser({password});
    if(updateError){setError(updateError.message);setBusy(false);return;}
    await supabase.auth.signOut({scope:"local"}); window.location.replace("/login?reset=1");
  }
  return <main className="auth-shell"><section className="auth-card">
    <div className="auth-brand"><span className="auth-brand-mark"><i/><i/><i/></span><strong>FELLACOO</strong></div>
    <div className="auth-heading"><span className="auth-icon"><ShieldCheck size={22}/></span><div><p>ACCOUNT SECURITY</p><h1>Set a new password.</h1></div></div>
    <p className="auth-subtitle">Choose a strong password for your Fellacoo workspace.</p>
    {error&&<div className="auth-alert error">{error}</div>}
    {!ready&&!error?<div className="auth-loading"><Loader2 size={20} className="spin"/> Verifying reset link…</div>:
    <form onSubmit={submit} className="auth-form">
      <label>Password<span className="auth-input-wrap"><LockKeyhole size={17}/><input type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} required/></span></label>
      <label>Confirm password<span className="auth-input-wrap"><LockKeyhole size={17}/><input type="password" autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)} required/></span></label>
      <button className="auth-submit" type="submit" disabled={busy}>{busy?<><Loader2 size={18} className="spin"/> Updating…</>:"Update password"}</button>
    </form>}
  </section></main>;
}
