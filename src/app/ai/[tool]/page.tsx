import { FeaturePage } from "@/components/platform/feature-page";

export default async function AiToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"AI / " + title} title={title} description="Use Fellacoo AI across website creation, content, assistance and automation while keeping actions connected to the platform." />;
}
