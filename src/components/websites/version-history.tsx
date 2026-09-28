"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, FileCode2, Globe2, Loader2, Pin, RotateCcw } from "lucide-react";

type Version = {
  id: string;
  version: number;
  status: string;
  total_bytes: number;
  initial_payload_bytes: number;
  created_at: string;
  pinned: boolean;
  files: Array<{ path?: string; bytes?: number }> | null;
};

type Site = {
  id: string;
  business_name: string;
  slug: string | null;
  published_url: string | null;
  live_version: number;
  status: string;
};

export function VersionHistory({ siteId }: { siteId: string }) {
  const [site, setSite] = useState<Site | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/websites/versions?siteId=" + encodeURIComponent(siteId), { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load versions.");
        if (!active) return;
        setSite(payload.site);
        setVersions(payload.versions ?? []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load versions.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, [siteId]);

  const liveVersion = useMemo(() => versions.find((version) => version.status.toUpperCase() === "LIVE"), [versions]);

  async function runVersionAction(versionId: string, actionName: "restore" | "pin" | "unpin") {
    if (actionName === "restore" && !window.confirm("Restore this version and make it live?")) return;
    setAction(versionId + ":" + actionName);
    try {
      const response = await fetch("/api/websites/versions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ siteId, versionId, action: actionName }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Version action failed.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Version action failed.");
    } finally { setAction(null); }
  }

  function bytes(value: number) {
    if (value < 1024) return value + " B";
    if (value < 1024 * 1024) return (value / 1024).toFixed(1) + " KB";
    return (value / (1024 * 1024)).toFixed(1) + " MB";
  }

  if (loading) {
    return <div className="version-loading"><Loader2 size={18} className="spin"/>Loading version history…</div>;
  }

  if (error || !site) {
    return <div className="version-error">{error || "Website not found."}</div>;
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-main version-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <Link href="/dashboard" className="builder-back"><ArrowLeft size={16}/>Dashboard</Link>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-primary">
            <section className="dashboard-card version-page">
              <div className="dashboard-eyebrow">WEBSITE / VERSIONS</div>
              <div className="version-heading">
                <div>
                  <h1>{site.business_name}</h1>
                  <p>Every published version is recorded here so your website has a clear deployment history.</p>
                </div>
                {site.published_url && (
                  <a className="domain-live-link" href={site.published_url} target="_blank" rel="noreferrer">
                    <ExternalLink size={15}/>Live website
                  </a>
                )}
              </div>

              <div className="version-summary">
                <div><span>Current version</span><strong>v{site.live_version || 0}</strong></div>
                <div><span>Published builds</span><strong>{versions.length}</strong></div>
                <div><span>Current status</span><strong>{site.status}</strong></div>
              </div>

              <div className="version-list">
                {versions.length === 0 ? (
                  <div className="version-empty">
                    <Clock3 size={28}/>
                    <strong>No published versions yet.</strong>
                    <p>Publish this website from the builder and its first version will appear here.</p>
                    <Link className="primary-action" href={"/builder/" + site.id}>Open Builder</Link>
                  </div>
                ) : versions.map((version) => (
                  <article className={"version-card " + (version.status.toUpperCase() === "LIVE" ? "is-live" : "")} key={version.id}>
                    <div className="version-icon">
                      {version.status.toUpperCase() === "LIVE" ? <CheckCircle2 size={18}/> : <FileCode2 size={18}/>}
                    </div>
                    <div className="version-copy">
                      <div className="version-title-row">
                        <strong>Version {version.version}</strong>
                        {version.status.toUpperCase() === "LIVE" && <span className="version-live-badge">LIVE</span>}
                        {version.pinned && <span className="version-pin"><Pin size={11}/>Pinned</span>}
                      </div>
                      <p>{new Date(version.created_at).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</p>
                      <small>{bytes(version.total_bytes)} · {version.files?.length ?? 0} published file{(version.files?.length ?? 0) === 1 ? "" : "s"}</small>
                    </div>
                    <div className="version-status"><span>{version.status}</span><div className="version-actions"><button onClick={() => void runVersionAction(version.id, version.pinned ? "unpin" : "pin")} disabled={!!action}><Pin size={12}/>{version.pinned ? "Unpin" : "Pin"}</button>{version.status.toUpperCase() !== "LIVE" && (<button onClick={() => void runVersionAction(version.id, "restore")} disabled={!!action}><RotateCcw size={12}/>{action === version.id + ":restore" ? "Restoring…" : "Restore live"}</button>)}</div></div>
                  </article>
                ))}
              </div>

              <div className="version-footer">
                <Globe2 size={15}/>
                <span>Publishing creates an immutable deployment record. Version restore/promotion can be added without changing the existing site data model.</span>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
