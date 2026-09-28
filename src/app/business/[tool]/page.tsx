import { FeaturePage } from "@/components/platform/feature-page";

export default async function BusinessToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Business / " + title} title={title} description="Operate the business layer connected to your website, including commerce, customers, leads, bookings and operations." />;
}
