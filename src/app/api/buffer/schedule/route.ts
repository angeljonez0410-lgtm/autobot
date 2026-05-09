import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBufferUpdate } from "@/lib/buffer";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = process.env.BUFFER_ACCESS_TOKEN;
    const supabase = getSupabaseServer();

    const postRecord = {
      business_id: body.businessId,
      platform: body.platform,
      caption: body.caption,
      image_url: body.imageUrl || null,
      hashtags: body.hashtags ?? [],
      cta: body.cta || null,
      scheduled_at: body.scheduledAt || null,
      status: body.status || "draft",
      buffer_profile_id: body.profileId || null,
    };

    if (supabase) {
      await supabase.from("posts").insert(postRecord);
    }

    if (!token) {
      return NextResponse.json(
        {
          demoMode: true,
          success: false,
          message: "Buffer not connected. Post saved only (if Supabase is configured).",
        },
        { status: 202 },
      );
    }

    if (!body.profileId) {
      return NextResponse.json({ error: "Buffer profile ID is required for live scheduling." }, { status: 400 });
    }

    const text = `${body.caption}\n\n${(body.hashtags ?? []).join(" ")}\n${body.cta ?? ""}`;
    const update = await createBufferUpdate({
      token,
      profileId: body.profileId,
      text,
      scheduledAt: body.scheduledAt,
      mediaUrl: body.imageUrl,
    });

    return NextResponse.json({ demoMode: false, success: true, update });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to schedule post" },
      { status: 500 },
    );
  }
}
