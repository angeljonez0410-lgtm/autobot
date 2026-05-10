"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useBusiness } from "@/lib/business-context";

// TODO: Replace with global selected business context
  const { selectedBusinessId } = useBusiness();

export default function BufferSettingsPage() {
  const { user, loading: authLoading } = useUser();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login";
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !selectedBusinessId) return;
    setLoading(true);
    fetch("/api/buffer/profiles")
      .then(res => res.json())
      .then(data => {
        setProfiles(data.profiles || []);
        setDemoMode(!!data.demoMode);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [user, selectedBusinessId]);

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!selectedBusinessId) return <div className="text-center py-12 text-pink-400">Select a business to manage Buffer integration.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Buffer Integration</h1>
      {demoMode && (
        <div className="mb-4 text-center text-pink-500">Demo mode: Buffer not connected. Posts will not be published live.</div>
      )}
      {error && <div className="text-center text-pink-500 mb-4">{error}</div>}
      <div className="grid gap-4">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && profiles.length === 0 && <div className="text-center text-gray-400">No Buffer profiles found.</div>}
        {profiles.map(profile => (
          <Card key={profile.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>{profile.formatted_username || profile.service}</CardTitle>
              <CardDescription>ID: {profile.id}</CardDescription>
            </div>
            <Button variant="secondary" disabled>Connected</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}