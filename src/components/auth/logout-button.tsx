"use client";
import { LogOut,Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function LogoutButton({compact=false}:{compact?:boolean}){
  const [busy,setBusy]=useState(false);
  async function logout(){
    if(busy)return; setBusy(true);
    const supabase=createClient();
    await supabase.auth.signOut({scope:"local"});
    await fetch("/api/auth/logout",{method:"POST",cache:"no-store"}).catch(()=>undefined);
    window.location.replace("/login?loggedOut=1");
  }
  return <button type="button" className={compact?"auth-logout compact":"auth-logout"} onClick={()=>void logout()} disabled={busy}>
    {busy?<Loader2 size={15} className="spin"/>:<LogOut size={15}/>}
    {!compact&&<span>{busy?"Signing out…":"Sign out"}</span>}
  </button>;
}
