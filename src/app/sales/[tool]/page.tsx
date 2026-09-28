import { FeaturePage } from "@/components/platform/feature-page";

export default async function SalesToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const title = tool.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return <FeaturePage section={"Sales & Finance / " + title} title={title} description="Manage quotes, invoices, payments, accounting and orders using the existing Fellacoo business data layer." />;
}
