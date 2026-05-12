import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ status: "error", error: "Supabase client not configured." });
  }
  // 1. Fetch scheduled content from your database
  const { data: posts, error } = await supabase
    .from("scheduled_posts")
    .select("*")
    .eq("status", "scheduled")
    .lte("publish_at", new Date().toISOString());

  if (error) {
    console.error("Error fetching scheduled posts:", error);
    return NextResponse.json({ status: "error", error: error.message });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ status: "ok", message: "No scheduled posts to publish." });
  }

  // 2. Publish each post (example: mark as published)
  let published = 0;
  for (const post of posts) {
    const { error: updateError } = await supabase
      .from("scheduled_posts")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", post.id);
    if (!updateError) published++;
  }

  // 3. (Optional) Trigger notifications, emails, or social posts here

  return NextResponse.json({ status: "ok", published });
}
