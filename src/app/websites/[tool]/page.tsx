import { FeaturePage } from "@/components/platform/feature-page";
import { DomainManager } from "@/components/websites/domain-manager";

export default async function WebsiteToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (tool === "domains") return <DomainManager />;

  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Websites / " + title} title={title} description="Manage website projects, domains and publishing from the same Fellacoo workspace." />;
}
