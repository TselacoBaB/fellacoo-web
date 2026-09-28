import { FeaturePage } from "@/components/platform/feature-page";

export default async function CommunicationToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Communication / " + title} title={title} description="Centralize WhatsApp, conversations, email and notifications around the same customer and website context." />;
}
