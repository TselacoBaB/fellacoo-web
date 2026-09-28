import { FeaturePage } from "@/components/platform/feature-page";

export default async function WebsiteToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Websites / " + title} title={title} description="Manage website projects, domains and publishing from the same Fellacoo workspace." />;
}
