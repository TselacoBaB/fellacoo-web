"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { ArrowLeft, CheckCircle2, Copy, Globe2, Loader2, Plus, Trash2 } from "lucide-react";

type Site = { id: string; business_name: string; slug: string | null; published_url: string | null };
type Domain = {
  id: string;
  site_id: string;
  hostname: string;
  domain_type: string;
  status: string;
  verified_at: string | null;
  records: Array<{ type: string; host: string; value: string; purpose: string }>;
  sslStatus: string | null;
};

export function DomainManager() {
  const [sites, setSites] = useState<Site[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [hostname, setHostname] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/websites/domains", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to load domains.");
      setSites(payload.sites ?? []);
      setDomains(payload.domains ?? []);
      setSelectedSite((current) => current || payload.sites?.[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load domains.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const selected = useMemo(() => sites.find((site) => site.id === selectedSite) ?? null, [sites, selectedSite]);
  const selectedDomains = domains.filter((domain) => domain.site_id === selectedSite);

  async function connectDomain() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/websites/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: selectedSite, hostname })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to connect domain.");
      setHostname("");
      setMessage("Domain added. Follow the DNS records below to verify it.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect domain.");
    } finally {
      setSaving(false);
    }
  }

  async function removeDomain(id: string) {
    if (!window.confirm("Remove this domain from Fellacoo?")) return;
    setError("");
    try {
      const response = await fetch("/api/websites/domains", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: id })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to remove domain.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove domain.");
    }
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied.");
      window.setTimeout(() => setMessage(""), 1400);
    } catch {}
  }

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
            <section className="dashboard-card domain-manager">
              <div className="dashboard-eyebrow">WEBSITES / DOMAINS</div>
              <h1>Domains for your websites.</h1>
              <p className="domain-lead">Every published website gets a Fellacoo address automatically. Connect a domain you own when you are ready.</p>

              {loading ? (
                <div className="domain-loading"><Loader2 size={18} className="spin"/>Loading websites…</div>
              ) : sites.length === 0 ? (
                <div className="domain-empty">
                  <Globe2 size={30}/>
                  <h2>Create your first website</h2>
                  <p>Publish a website first, then its Fellacoo address and custom-domain controls will appear here.</p>
                  <Link href="/builder/new/site" className="primary-action"><Plus size={16}/>Create Website</Link>
                </div>
              ) : (
                <>
                  <div className="domain-site-picker">
                    <label>
                      <span>Website</span>
                      <select value={selectedSite} onChange={(event) => setSelectedSite(event.target.value)}>
                        {sites.map((site) => <option key={site.id} value={site.id}>{site.business_name}</option>)}
                      </select>
                    </label>
                    {selected?.published_url ? (
                      <a className="domain-live-link" href={selected.published_url} target="_blank" rel="noreferrer">
                        <CheckCircle2 size={15}/>Open live website
                      </a>
                    ) : (
                      <Link className="domain-live-link muted" href={"/builder/" + selected?.id}>Open builder</Link>
                    )}
                  </div>

                  <div className="domain-list">
                    <div className="domain-list-heading"><h2>Connected addresses</h2><span>{selectedDomains.length}</span></div>
                    {selectedDomains.length === 0 && <p className="domain-muted">No domain records yet. Publish this website to create its Fellacoo address.</p>}
                    {selectedDomains.map((domain) => (
                      <article className="domain-card" key={domain.id}>
                        <div className="domain-card-main">
                          <span className={"domain-status-dot " + domain.status.toLowerCase()}/>
                          <div>
                            <strong>{domain.hostname}</strong>
                            <small>{domain.domain_type === "CUSTOM" ? "Custom domain" : "Fellacoo address"} · {domain.status.replaceAll("_", " ")}</small>
                          </div>
                        </div>
                        <div className="domain-card-actions">
                          <button type="button" onClick={() => copy(domain.hostname)} title="Copy domain"><Copy size={15}/></button>
                          {domain.domain_type === "CUSTOM" && <button type="button" onClick={() => removeDomain(domain.id)} title="Remove domain"><Trash2 size={15}/></button>}
                        </div>
                        {domain.domain_type === "CUSTOM" && domain.records.length > 0 && (
                          <div className="dns-records">
                            <small>DNS / verification records</small>
                            {domain.records.map((record, index) => (
                              <div className="dns-row" key={record.type + record.host + index}>
                                <b>{record.type}</b>
                                <code>{record.host}</code>
                                <code>{record.value}</code>
                                <button type="button" onClick={() => copy(record.value)}><Copy size={13}/></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>

                  <div className="domain-connect-card">
                    <div>
                      <span className="domain-connect-icon"><Globe2 size={18}/></span>
                      <div><strong>Connect a custom domain</strong><p>Use a domain you already own, such as <b>mybusiness.co.za</b>.</p></div>
                    </div>
                    <div className="domain-connect-form">
                      <input value={hostname} onChange={(event) => setHostname(event.target.value)} placeholder="mybusiness.co.za" onKeyDown={(event) => { if (event.key === "Enter") void connectDomain(); }}/>
                      <button type="button" onClick={connectDomain} disabled={saving || !hostname.trim()}>{saving ? <Loader2 size={15} className="spin"/> : <Plus size={15}/>}Connect</button>
                    </div>
                  </div>
                </>
              )}

              {message && <div className="domain-feedback success">{message}</div>}
              {error && <div className="domain-feedback error">{error}</div>}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
