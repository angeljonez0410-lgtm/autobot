"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESSES, BRAND_VOICE } from "@/lib/data";

type Health = {
  supabaseConfigured: boolean;
  bufferConfigured: boolean;
  aiConfigured: boolean;
};

export default function SettingsPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [profiles, setProfiles] = useState<Array<{ id: string; service: string; formatted_username?: string }>>([]);
  const [message, setMessage] = useState("No checks run yet.");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setMessage("Failed to check environment health."));
  }, []);

  async function fetchProfiles() {
    try {
      const response = await fetch("/api/buffer/profiles");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to fetch profiles");
      setProfiles(data.profiles ?? []);
      setMessage(data.demoMode ? "Buffer not connected: demo profiles shown." : "Connected to live Buffer profiles.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile fetch failed");
    }
  }

  return (
    <section className="grid gap-5">
      <Card>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Buffer/API settings, brand voice, business and hashtag defaults.</CardDescription>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Connection Checks</CardTitle>
          <p className="mt-3 text-sm">Supabase: {health?.supabaseConfigured ? "Configured" : "Missing keys"}</p>
          <p className="text-sm">Buffer: {health?.bufferConfigured ? "Configured" : "Demo mode"}</p>
          <p className="text-sm">AI Provider: {health?.aiConfigured ? "Configured" : "Demo mode"}</p>
          <Button className="mt-3" variant="outline" onClick={fetchProfiles}>
            Fetch Buffer Profiles
          </Button>
          <p className="mt-2 text-xs text-[#7f536b]">{message}</p>
          <div className="mt-3 grid gap-2 text-xs">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-xl bg-[#fff5fa] p-2">
                {profile.service} - {profile.formatted_username ?? profile.id}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Brand Voice + Defaults</CardTitle>
          <Textarea defaultValue={BRAND_VOICE} />
          <Input className="mt-3" defaultValue="#Mompreneur #MakeMoneyTonight #SmallBusiness" />
          <Input className="mt-3" defaultValue="DM READY to order" />
          <div className="mt-3 grid gap-2 text-sm">
            {BUSINESSES.map((biz) => (
              <div key={biz.id} className="rounded-xl bg-[#fff9ef] p-2">
                {biz.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
