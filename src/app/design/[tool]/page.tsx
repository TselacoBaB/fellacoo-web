import { FeaturePage } from "@/components/platform/feature-page";

export default async function DesignToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Design / " + title} title={title} description="Manage reusable design assets, brand systems and website components from one shared workspace." />;
}
