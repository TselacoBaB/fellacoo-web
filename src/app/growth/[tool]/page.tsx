import { FeaturePage } from "@/components/platform/feature-page";

export default async function GrowthToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Growth / " + title} title={title} description="Turn website activity into measurable growth with analytics, conversion tools, campaigns and automations." />;
}
