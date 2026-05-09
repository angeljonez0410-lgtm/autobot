import { NextResponse } from "next/server";
import { fetchBufferProfiles } from "@/lib/buffer";

export async function GET() {
  const token = process.env.BUFFER_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      demoMode: true,
      profiles: [
        { id: "demo-ig", service: "instagram", formatted_username: "demo_instagram" },
        { id: "demo-fb", service: "facebook", formatted_username: "demo_facebook_page" },
        { id: "demo-tt", service: "tiktok", formatted_username: "demo_tiktok" },
      ],
      message: "Buffer token missing. Demo mode only; no live posting available.",
    });
  }

  try {
    const profiles = await fetchBufferProfiles(token);
    return NextResponse.json({ demoMode: false, profiles });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Buffer profiles" },
      { status: 500 },
    );
  }
}
