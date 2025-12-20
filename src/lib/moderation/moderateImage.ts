export interface ModerateImageResult {
  allow: boolean;
  reason?: string;
}

export async function moderateImageDataUrl(
  dataUrl: string
): Promise<ModerateImageResult> {
  try {
    const response = await fetch("/api/moderate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataUrl }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        reason?: string;
      };
      return {
        allow: false,
        reason: errorData.reason ?? "moderation_unavailable",
      };
    }

    const data = (await response.json()) as { allow?: boolean; reason?: string };
    return {
      allow: data.allow === true,
      reason: data.allow === true ? undefined : data.reason ?? "blocked",
    };
  } catch {
    return { allow: false, reason: "moderation_unavailable" };
  }
}
