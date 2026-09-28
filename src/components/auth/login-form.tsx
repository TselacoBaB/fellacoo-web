"use client";

import { FormEvent,useEffect,useRef,useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { Eye,EyeOff,Loader2,LockKeyhole,Mail,ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm(){
  const router=useRouter();
  const searchParams=useSearchParams();
  const nextPath=(()=>{const value=searchParams.get("next");return value&&value.startsWith("/")&&!value.startsWith("//")?value:"/dashboard";})();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const mounted=useRef(true);

  useEffect(()=>()=>{mounted.current=false;},[]);

  useEffect(()=>{
    const code=searchParams.get("error");
    if(code==="callback_failed")setError("That sign-in link has expired or is no longer valid.");
    if(code==="missing_callback_code")setError("The sign-in link is incomplete.");
    if(searchParams.get("loggedOut")==="1")setMessage("You have been signed out securely.");
    if(searchParams.get("reset")==="1")setMessage("Your password has been updated. Please sign in again.");
  },[searchParams]);

  useEffect(()=>{
    const supabase=createClient();
    let alive=true;
    void supabase.auth.getUser().then(({data:{user}})=>{if(alive&&user)router.replace("/dashboard");});
    const {data:listener}=supabase.auth.onAuthStateChange((event,session)=>{
      if(alive&&session&&event!=="SIGNED_OUT")router.replace("/dashboard");
    });
    const onPageshow=()=>{void supabase.auth.getUser().then(({data:{user}})=>{if(user)router.replace("/dashboard");});};
    window.addEventListener("pageshow",onPageshow);
    return()=>{alive=false;listener.subscription.unsubscribe();window.removeEventListener("pageshow",onPageshow);};
  },[router]);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); if(busy)return;
    setBusy(true);setError("");setMessage("");
    try{
      const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({email,password})});
      const payload=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(payload.error||"Unable to sign in.");
      if(mounted.current)setMessage("Signed in. Opening your workspace…");
      window.location.replace(nextPath);
    }catch(err){
      if(mounted.current){setError(err instanceof Error?err.message:"Unable to sign in.");setBusy(false);}
    }
  }

  async function forgotPassword(){
    if(!email.trim()){setError("Enter your email address first.");return;}
    setBusy(true);setError("");setMessage("");
    try{
      const response=await fetch("/api/auth/reset",{method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({email})});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Unable to send the reset email.");
      setMessage(payload.message);
    }catch(err){setError(err instanceof Error?err.message:"Unable to send the reset email.");}
    finally{if(mounted.current)setBusy(false);}
  }

  return <main className="auth-shell"><section className="auth-card">
    <div className="auth-brand"><span className="auth-brand-mark"><i/><i/><i/></span><strong>FELLACOO</strong></div>
    <div className="auth-heading"><span className="auth-icon"><ShieldCheck size={22}/></span><div><p>SECURE WORKSPACE</p><h1>Welcome back.</h1></div></div>
    <p className="auth-subtitle">Sign in to manage your websites, business tools and growth engine.</p>
    {error&&<div className="auth-alert error">{error}</div>}
    {message&&<div className="auth-alert success">{message}</div>}
    <form onSubmit={submit} className="auth-form">
      <label>Email address<span className="auth-input-wrap"><Mail size={17}/><input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></span></label>
      <label>Password<span className="auth-input-wrap"><LockKeyhole size={17}/><input type={showPassword?"text":"password"} autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></span></label>
      <button type="button" className="auth-forgot" onClick={()=>void forgotPassword()} disabled={busy}>Forgot password?</button>
      <button type="submit" className="auth-submit" disabled={busy}>{busy?<><Loader2 size={18} className="spin"/> Signing in…</>:"Sign in to Fellacoo"}</button>
    </form>
    <div className="auth-security-note"><LockKeyhole size={14}/><span>Your session uses Supabase Auth cookies and server-side route protection.</span></div>
    <div style={{ marginTop: 18, textAlign: "center" }}>
      <a href="/signup">Create a new Fellacoo account</a>
    </div>
  </section></main>;
}
