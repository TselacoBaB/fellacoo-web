import { NextResponse } from "next/server";
import { getFelacooIdentity } from "@/server/auth/felacoo-identity";
import { publishWebsite } from "@/server/services/publishing-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const identity = await getFelacooIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await request.json() as {
      buildRequestId?: string;
      slug?: string;
    };

    if (!body.buildRequestId?.trim()) {
      return NextResponse.json({ error: "buildRequestId is required." }, { status: 400 });
    }

    const result = await publishWebsite({
      buildRequestId: body.buildRequestId.trim(),
      ownerId: identity.felacooUserId,
      slug: body.slug?.trim() || null,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to publish website." },
      { status: 500 }
    );
  }
}
