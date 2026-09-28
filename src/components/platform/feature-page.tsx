"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/navigation/app-sidebar";

export function FeaturePage({
  section,
  title,
  description,
  eyebrow = "FELLACOO PLATFORM"
}: {
  section: string;
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <main className="dashboard-shell">
      <AppSidebar />
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <Link href="/dashboard" className="builder-back"><ArrowLeft size={16}/>Dashboard</Link>
          </div>
        </header>
        <div className="dashboard-content">
          <div className="dashboard-primary">
            <section className="dashboard-card feature-route-card">
              <div className="dashboard-eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
              <p>{description}</p>
              <div className="feature-route-status">
                <span><Sparkles size={15}/>Workspace route is active</span>
                <span>{section}</span>
              </div>
              <Link href="/builder/new/site" className="primary-action">
                Open Website Builder <ArrowRight size={16}/>
              </Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
