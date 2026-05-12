"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import type { User } from "@supabase/auth-js";
import { supabase } from "@/lib/supabase";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useBusiness } from "@/lib/business-context";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useUser() as { user: User | null, loading: boolean };
  const { selectedBusinessId } = useBusiness();
  type AnalyticsEvent = {
    id: string;
    event: string;
    value: number;
    created_at: string;
  };
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login";
  }, [user, authLoading]);

  useEffect(() => {
    if (!user || !selectedBusinessId) return;
    (async () => {
      setLoading(true);
      if (!supabase) {
        setError("Supabase client not configured.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("user_id", user.id)
        .eq("business_id", selectedBusinessId)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setEvents(data || []);
      setLoading(false);
    })();
  }, [user, selectedBusinessId]);

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!selectedBusinessId) return <div className="text-center py-12 text-pink-400">Select a business to view analytics.</div>;

  return (
    <section className="grid gap-5">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Analytics</h1>
      {error && <div className="text-center text-pink-500 mb-4">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && events.length === 0 && <div className="text-center text-gray-400">No analytics events yet.</div>}
        {events.map(event => (
          <Card key={event.id}>
            <CardTitle>{event.event}</CardTitle>
            <CardDescription>Value: {event.value}</CardDescription>
            <CardDescription>Date: {new Date(event.created_at).toLocaleString()}</CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
