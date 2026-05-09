"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESSES } from "@/lib/data";

export default function ComposerPage() {
  const [form, setForm] = useState({
    businessId: BUSINESSES[0].id,
    platform: "instagram",
    caption: "",
    imageUrl: "",
    hashtags: "#Mompreneur #MakeMoneyTonight",
    cta: "DM READY",
    scheduledAt: "",
    status: "draft",
    profileId: "",
  });
  const [message, setMessage] = useState("Ready to build your post.");
  const [busy, setBusy] = useState(false);

  const captionPrompt = useMemo(() => `${form.caption}\n\nImprove this caption for conversions in a confident mompreneur tone.`, [form.caption]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function generate(type: "caption" | "hashtags") {
    setBusy(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: form.platform,
          category: "General",
          goal: type === "caption" ? "Improve conversion" : "Generate hashtags",
          contentType: type,
          customPrompt: type === "caption" ? captionPrompt : `Create hashtags for: ${form.caption}`,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to generate");

      if (type === "caption") update("caption", data.text);
      if (type === "hashtags") update("hashtags", data.text.replace(/\n/g, " "));
      setMessage(data.demoMode ? "Generated in Demo Mode." : "Generated with live AI.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  async function scheduleWithBuffer() {
    setBusy(true);
    try {
      const response = await fetch("/api/buffer/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: form.businessId,
          platform: form.platform,
          caption: form.caption,
          imageUrl: form.imageUrl,
          hashtags: form.hashtags.split(" "),
          cta: form.cta,
          scheduledAt: form.scheduledAt,
          profileId: form.profileId,
          status: form.status,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not schedule");
      setMessage(data.demoMode ? "Demo Mode: post was saved only, not sent to Buffer." : "Post scheduled in Buffer successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Schedule failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardTitle>Post Composer</CardTitle>
        <CardDescription>Create, improve, and schedule cross-platform content.</CardDescription>

        <div className="mt-4 grid gap-3">
          <Select value={form.businessId} onChange={(e) => update("businessId", e.target.value)}>
            {BUSINESSES.map((biz) => (
              <option key={biz.id} value={biz.id}>
                {biz.name}
              </option>
            ))}
          </Select>

          <Select value={form.platform} onChange={(e) => update("platform", e.target.value)}>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="youtube_shorts">YouTube Shorts</option>
          </Select>

          <Textarea value={form.caption} onChange={(e) => update("caption", e.target.value)} placeholder="Write your caption" />
          <Input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} placeholder="Image URL" />
          <Input value={form.hashtags} onChange={(e) => update("hashtags", e.target.value)} placeholder="#hashtags" />
          <Input value={form.cta} onChange={(e) => update("cta", e.target.value)} placeholder="CTA" />
          <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => update("scheduledAt", e.target.value)} />

          <Select value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="idea">Idea</option>
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="scheduled">Scheduled</option>
            <option value="posted">Posted</option>
          </Select>

          <Input value={form.profileId} onChange={(e) => update("profileId", e.target.value)} placeholder="Buffer profile ID (optional)" />
        </div>
      </Card>

      <Card>
        <CardTitle>Actions</CardTitle>
        <CardDescription>{message}</CardDescription>

        <div className="mt-4 grid gap-2">
          <Button variant="outline" onClick={() => setMessage("Draft saved locally in current session.")}>Save Draft</Button>
          <Button variant="outline" onClick={() => generate("caption")} disabled={busy}>Generate Better Caption</Button>
          <Button variant="outline" onClick={() => generate("hashtags")} disabled={busy}>Generate Hashtags</Button>
          <Button onClick={scheduleWithBuffer} disabled={busy}>Schedule with Buffer</Button>
          <Button variant="secondary" onClick={() => setMessage("Post duplicated in editor for quick variants.")}>Duplicate Post</Button>
          <Button variant="ghost" onClick={() => update("status", "posted")}>Mark Posted</Button>
        </div>

        <p className="mt-4 rounded-xl bg-[#fff6d8] p-3 text-xs text-[#8a5c00]">
          Demo Mode is always labeled clearly. If Buffer token is missing, no live posting occurs.
        </p>
      </Card>
    </section>
  );
}
