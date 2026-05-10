"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const BUSINESS_CATEGORIES = [
  "T-shirts","Hoodies","Mugs","Tumblers","Rugs","Blankets","Canva templates","Ebooks","Resume/job tools","Food business","Stuffed peppers","Lemonade/slushies","Affiliate products","Dropshipping","Custom crafts","Digital products","Other"
];

export type BusinessFormData = {
  name: string;
  type: string;
  logo_url: string;
  brand_colors: string;
  brand_voice: string;
  target_audience: string;
  hashtags: string;
  content_rules: string;
  goals: string;
};

export function BusinessForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<BusinessFormData>;
  onSubmit: (data: BusinessFormData) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<BusinessFormData>({
    name: initial?.name || "",
    type: initial?.type || BUSINESS_CATEGORIES[0],
    logo_url: initial?.logo_url || "",
    brand_colors: initial?.brand_colors || "#f7c1e3,#b095f7,#1b1721,#fff,#ffd27f",
    brand_voice: initial?.brand_voice || "Motivational, cute, aggressive, bossy, helpful, beginner-friendly, money-focused",
    target_audience: initial?.target_audience || "",
    hashtags: initial?.hashtags || "",
    content_rules: initial?.content_rules || "",
    goals: initial?.goals || "",
  });
  const [error, setError] = useState<string>("");

  function update<K extends keyof BusinessFormData>(key: K, value: BusinessFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(form: BusinessFormData) {
    if (!form.name.trim()) return "Business name is required.";
    if (!form.type.trim()) return "Business type is required.";
    return "";
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={e => {
        e.preventDefault();
        const err = validate(form);
        if (err) {
          setError(err);
          return;
        }
        setError("");
        onSubmit(form);
      }}
    >
      {error && <div className="text-pink-500 text-sm text-center">{error}</div>}
      <Input
        label="Business Name"
        value={form.name}
        onChange={e => update("name", e.target.value)}
        required
        helperText="This is the public name for your business."
      />
      <label className="text-sm font-medium">Business Type</label>
      <select
        className="rounded-xl border px-3 py-2"
        value={form.type}
        onChange={e => update("type", e.target.value)}
      >
        {BUSINESS_CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <Input
        label="Logo URL"
        value={form.logo_url}
        onChange={e => update("logo_url", e.target.value)}
        placeholder="https://..."
        helperText="Paste a link to your logo image (optional)."
      />
      <Input
        label="Brand Colors (comma separated)"
        value={form.brand_colors}
        onChange={e => update("brand_colors", e.target.value)}
        placeholder="#f7c1e3,#b095f7,#1b1721,#fff,#ffd27f"
        helperText="Comma-separated hex codes for your brand colors."
      />
      <Textarea
        label="Brand Voice"
        value={form.brand_voice}
        onChange={e => update("brand_voice", e.target.value)}
        placeholder="Motivational, cute, aggressive, bossy, helpful, beginner-friendly, money-focused"
        helperText="Describe your brand's personality and tone."
      />
      <Textarea
        label="Target Audience"
        value={form.target_audience}
        onChange={e => update("target_audience", e.target.value)}
        helperText="Who are you selling to? (e.g. busy moms, entrepreneurs)"
      />
      <Input
        label="Hashtags (comma separated)"
        value={form.hashtags}
        onChange={e => update("hashtags", e.target.value)}
        placeholder="#boss,#girlboss,#sidehustle"
        helperText="Comma-separated hashtags for your brand."
      />
      <Textarea
        label="Content Rules"
        value={form.content_rules}
        onChange={e => update("content_rules", e.target.value)}
        placeholder="No cursing, always add CTA, etc."
        helperText="Any rules or guidelines for your content?"
      />
      <Textarea
        label="Business Goals"
        value={form.goals}
        onChange={e => update("goals", e.target.value)}
        placeholder="Hit $1k/month, launch new product, etc."
        helperText="What are your main business goals?"
      />
      <Button type="submit" disabled={loading} className="bg-gradient-to-r from-pink-300 to-purple-300 text-black font-bold mt-2">
        {loading ? "Saving..." : "Save Business"}
      </Button>
    </form>
  );
}
