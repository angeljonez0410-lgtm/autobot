"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_CATEGORIES, BRAND_VOICE, CONTENT_TEMPLATES } from "@/lib/data";

const contentTypes = [
  "TikTok caption",
  "Instagram caption",
  "Facebook post",
  "Pinterest description",
  "YouTube Shorts title",
  "Hashtags",
  "Hooks",
  "Product promo post",
  "Story post",
  "Email promo copy",
  "Launch post",
  "UGC-style script",
  "Mompreneur money content",
  "Motivational aggressive but cute",
];


  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  // TODO: Get selected business from global state or context
  const selectedBusinessId = null; // Replace with actual selected business logic
  const [platform, setPlatform] = useState("instagram");
  const [category, setCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [goal, setGoal] = useState("Get DMs tonight");
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState("Demo suggestion loaded from templates.");
  const [saveStatus, setSaveStatus] = useState("");

  const fallback = useMemo(() => CONTENT_TEMPLATES.find((tpl) => tpl.category.includes(category.split(" ")[0])) ?? CONTENT_TEMPLATES[0], [category]);


  // Early returns for auth and business selection
  if (!authLoading && !user) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }
  if (!selectedBusinessId) {
    return (
      <div className="text-center py-12 text-pink-400">
        Select a business to generate content.
      </div>
    );
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, category, goal, contentType, voice: BRAND_VOICE }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Generation failed");
      setOutput(data.text);
      setMeta(data.demoMode ? "Demo mode active: generated without API key." : "Live AI mode active.");
    } catch (error) {
      setOutput(`${fallback.hook}\n\n${fallback.body}\n\n${fallback.cta}\n\n${fallback.hashtags.join(" ")}`);
      setMeta(error instanceof Error ? error.message : "Using fallback template");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    setSaveStatus("");
    if (!user || !selectedBusinessId || !output) return;
    setLoading(true);
    // Save as draft post
    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        business_id: selectedBusinessId,
        content: output,
        platform,
        status: "draft",
      },
    ]).select();
    if (error) setSaveStatus(error.message);
    else setSaveStatus("Draft saved!");
    setLoading(false);
  }

  async function handleSendToApproval() {
    setSaveStatus("");
    if (!user || !selectedBusinessId || !output) return;
    setLoading(true);
    // Save post and add to approval queue
    const { data: postData, error: postError } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        business_id: selectedBusinessId,
        content: output,
        platform,
        status: "generated",
      },
    ]).select();
    if (postError || !postData?.[0]) {
      setSaveStatus(postError?.message || "Failed to save post");
      setLoading(false);
      return;
    }
    const post_id = postData[0].id;
    const { error: queueError } = await supabase.from("approval_queue").insert([
      {
        post_id,
        status: "generated",
      },
    ]);
    if (queueError) setSaveStatus(queueError.message);
    else setSaveStatus("Sent to approval queue!");
    setLoading(false);
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <Card>
        <CardTitle>AI Content Generator</CardTitle>
        <CardDescription>Brand voice: confident, motivational, beginner-friendly, and conversion-focused.</CardDescription>

        <div className="mt-4 grid gap-3">
          <Select value={contentType} onChange={(e) => setContentType(e.target.value)}>
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="youtube_shorts">YouTube Shorts</option>
          </Select>

          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {BUSINESS_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Primary result you want" />

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>Generated Output</CardTitle>
        <CardDescription>{meta}</CardDescription>
        <Textarea className="mt-4 min-h-[320px]" value={output} onChange={(e) => setOutput(e.target.value)} />
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSaveDraft} disabled={loading || !output}>Save as Draft</Button>
          <Button onClick={handleSendToApproval} disabled={loading || !output}>Send to Approval Queue</Button>
        </div>
        {saveStatus && <div className="mt-2 text-center text-pink-500">{saveStatus}</div>}
      </Card>
    </section>
  );
}
