import { BuilderEditor } from "@/components/builder/builder-editor";

export default async function BuilderProjectPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <BuilderEditor projectId={projectId} />;
}
