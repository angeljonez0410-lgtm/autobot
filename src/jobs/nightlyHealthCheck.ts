// Nightly site health check and auto-fix job
// This script scans for broken links and missing data, and logs or fixes issues.
// Extend this with more checks as needed.

import { supabase } from "../lib/supabase";

export default async function handler() {
  // Example: Check for posts with missing content
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, content")
    .is("content", null);

  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }

  if (posts && posts.length > 0) {
    for (const post of posts) {
      // Example fix: set content to a placeholder
      await supabase.from("posts").update({ content: "[Missing content]" }).eq("id", post.id);
      console.log(`Fixed missing content for post ${post.id}`);
    }
  } else {
    console.log("No missing content found.");
  }

  // Add more health checks and fixes here
}
