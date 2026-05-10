"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import type { User } from "@supabase/auth-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminOverridePage() {
  const { user, loading: authLoading } = useUser() as { user: User | null, loading: boolean };
  const [overrides, setOverrides] = useState<any[]>([]);
  const [targetEmail, setTargetEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only allow admin (hardcoded for now)
  const isAdmin = user?.email === "admin@zu.com";

  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login";
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    setLoading(true);
    supabase
      .from("admin_overrides")
      .select("*, profiles: user_id (email)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setOverrides(data || []);
        setLoading(false);
      });
  }, [user, isAdmin]);

  async function handleAddOverride() {
    setError("");
    if (!user || !isAdmin || !targetEmail || !plan) return;
    setLoading(true);
    // Find user by email
    const { data: users, error: userError } = await supabase.from("profiles").select("id").eq("email", targetEmail);
    if (userError || !users?.[0]) {
      setError("User not found");
      setLoading(false);
      return;
    }
    const user_id = users[0].id;
    const { error: insertError } = await supabase.from("admin_overrides").insert([
      {
        user_id,
        plan,
        expires_at: expiresAt || null,
      },
    ]);
    if (insertError) setError(insertError.message);
    setTargetEmail("");
    setPlan("");
    setExpiresAt("");
    // Refresh
    const { data } = await supabase
      .from("admin_overrides")
      .select("*, profiles: user_id (email)")
      .order("created_at", { ascending: false });
    setOverrides(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await supabase.from("admin_overrides").delete().eq("id", id);
    setOverrides(overrides => overrides.filter(o => o.id !== id));
    setLoading(false);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!isAdmin) return <div className="text-center py-12 text-pink-400">Admin access only.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Admin Plan Overrides</h1>
      <div className="mb-6 grid gap-2">
        <Input
          value={targetEmail}
          onChange={e => setTargetEmail(e.target.value)}
          placeholder="User email"
        />
        <Input
          value={plan}
          onChange={e => setPlan(e.target.value)}
          placeholder="Plan (e.g. pro, boss, free)"
        />
        <Input
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          placeholder="Expires at (YYYY-MM-DD or blank)"
        />
        <Button onClick={handleAddOverride} disabled={loading || !targetEmail || !plan}>Add Override</Button>
      </div>
      {error && <div className="text-center text-pink-500 mb-4">{error}</div>}
      <div className="grid gap-4">
        {loading && <div className="text-center text-gray-400">Loading overrides...</div>}
        {!loading && overrides.length === 0 && <div className="text-center text-gray-400">No overrides yet.</div>}
        {overrides.map(override => (
          <Card key={override.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>{override.profiles?.email || "Unknown user"}</CardTitle>
              <CardDescription>Plan: {override.plan}</CardDescription>
              <CardDescription>Expires: {override.expires_at ? new Date(override.expires_at).toLocaleDateString() : "Never"}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => handleDelete(override.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}