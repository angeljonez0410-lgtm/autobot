import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ status: "error", error: "Supabase client not configured." });
  }
  // Example: Check for posts with missing content
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, content")
    .is("content", null);

  if (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ status: "error", error: error.message });
  }

  let fixed = 0;
  if (posts && posts.length > 0) {
    for (const post of posts) {
      await supabase.from("posts").update({ content: "[Missing content]" }).eq("id", post.id);
      fixed++;
    }
  }

  return NextResponse.json({ status: "ok", fixed });
}
