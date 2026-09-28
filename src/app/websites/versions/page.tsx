import { VersionHistory } from "@/components/websites/version-history";

export default async function WebsiteVersionsPage({
  searchParams
}: {
  searchParams: Promise<{ site?: string }>;
}) {
  const params = await searchParams;
  return <VersionHistory siteId={params.site ?? ""} />;
}
