import { NextResponse } from "next/server";

const MAX_DATA_URL_LENGTH = 5_000_000;

export async function POST(request: Request) {
  let payload: { dataUrl?: unknown } = {};

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { allow: false, reason: "invalid_json" },
      { status: 400 }
    );
  }

  const dataUrl = payload.dataUrl;
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { allow: false, reason: "invalid_data_url" },
      { status: 400 }
    );
  }

  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json(
      { allow: false, reason: "payload_too_large" },
      { status: 413 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { allow: false, reason: "moderation_unavailable" },
      { status: 503 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: [
          {
            type: "image_url",
            image_url: { url: dataUrl },
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { allow: false, reason: "moderation_unavailable" },
        { status: 503 }
      );
    }

    const data = (await response.json()) as {
      results?: Array<{ flagged?: boolean; categories?: Record<string, unknown> }>;
    };

    const result = data.results?.[0];
    if (!result) {
      return NextResponse.json(
        { allow: false, reason: "moderation_unavailable" },
        { status: 503 }
      );
    }
    const flagged = result.flagged === true;

    return NextResponse.json({
      allow: !flagged,
      flagged,
      categories: result?.categories ?? {},
    });
  } catch {
    return NextResponse.json(
      { allow: false, reason: "moderation_unavailable" },
      { status: 503 }
    );
  }
}
