"use client";

import { useMemo, useState } from "react";
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

export default function GeneratorPage() {
  const [platform, setPlatform] = useState("instagram");
  const [category, setCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [goal, setGoal] = useState("Get DMs tonight");
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState("Demo suggestion loaded from templates.");

  const fallback = useMemo(() => CONTENT_TEMPLATES.find((tpl) => tpl.category.includes(category.split(" ")[0])) ?? CONTENT_TEMPLATES[0], [category]);

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
      </Card>
    </section>
  );
}
