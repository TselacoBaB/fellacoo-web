export type PublishInput = { buildRequestId: string; slug: string };

export async function publishWebsite(input: PublishInput) {
  return {
    ok: false,
    message: `Publishing boundary ready for ${input.slug} (${input.buildRequestId}).`
  };
}