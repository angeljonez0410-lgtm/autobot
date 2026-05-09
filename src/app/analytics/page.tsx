"use client";

import { useMemo, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEMO_POSTS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [bestPlatform, setBestPlatform] = useState("instagram");
  const [revenueGoal, setRevenueGoal] = useState(1200);
  const [leads, setLeads] = useState(27);
  const [orders, setOrders] = useState(8);
  const [streak, setStreak] = useState(6);

  const stats = useMemo(() => {
    const scheduled = DEMO_POSTS.filter((p) => p.status === "scheduled").length;
    const published = DEMO_POSTS.filter((p) => p.status === "posted").length;
    return { scheduled, published };
  }, []);

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardTitle>{stats.scheduled}</CardTitle>
          <CardDescription>Posts scheduled</CardDescription>
        </Card>
        <Card>
          <CardTitle>{stats.published}</CardTitle>
          <CardDescription>Posts published</CardDescription>
        </Card>
        <Card>
          <CardTitle>{formatCurrency(revenueGoal)}</CardTitle>
          <CardDescription>Revenue goal</CardDescription>
        </Card>
      </div>

      <Card>
        <CardTitle>Manual Performance Tracker</CardTitle>
        <CardDescription>Update performance numbers quickly as leads and orders come in.</CardDescription>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input value={bestPlatform} onChange={(e) => setBestPlatform(e.target.value)} placeholder="Best-performing platform" />
          <Input type="number" value={revenueGoal} onChange={(e) => setRevenueGoal(Number(e.target.value) || 0)} placeholder="Revenue goal" />
          <Input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value) || 0)} placeholder="Leads" />
          <Input type="number" value={orders} onChange={(e) => setOrders(Number(e.target.value) || 0)} placeholder="Orders" />
          <Input type="number" value={streak} onChange={(e) => setStreak(Number(e.target.value) || 0)} placeholder="Content streak" />
        </div>

        <div className="mt-4 rounded-2xl bg-[#1b1721] p-4 text-sm text-[#ffd27f]">
          Best platform: <strong className="uppercase">{bestPlatform}</strong> | Leads: {leads} | Orders: {orders} | Streak: {streak} days
        </div>
      </Card>
    </section>
  );
}
