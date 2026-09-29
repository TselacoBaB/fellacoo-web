import { redirect } from "next/navigation";
import { BuilderEditor } from "@/components/builder/builder-editor";

export default async function NewWebsitePage({
  searchParams
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;

  if (params.mode !== "blank") {
    redirect("/design/templates");
  }

  return <BuilderEditor />;
}
