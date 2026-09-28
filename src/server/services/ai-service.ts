export type AiGenerationInput = {
  businessName: string;
  activity: string;
  location?: string;
  goal?: string;
};

export type AiGenerationResult = {
  title: string;
  sections: Array<{ type: "hero" | "features" | "cta"; props: Record<string, unknown> }>;
};

export async function generateWebsite(input: AiGenerationInput): Promise<AiGenerationResult> {
  return { title: input.businessName, sections: [] };
}