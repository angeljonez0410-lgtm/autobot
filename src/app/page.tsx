import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles, Target, Wallet } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { StatusBadge } from "@/components/status-badge";
import { BUSINESSES, DEMO_POSTS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const today = DEMO_POSTS.filter((post) => post.scheduledAt).slice(0, 4);

  return (
    <section className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-[#b95e86]">Today at a glance</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Crush your content and close sales tonight</h2>
              <p className="mt-2 text-sm text-[#7f536b]">
                Track scheduled posts, polish high-converting captions, and launch across your platforms without overwhelm.
              </p>
            </div>
            <Button asChild>
              <Link href="/generator">
                Generate Post <Sparkles size={16} className="ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Card className="bg-[#fff6d8] p-4">
              <div className="flex items-center gap-2 text-[#8a5c00]">
                <Target size={16} />
                <p className="text-xs uppercase">Revenue Goal</p>
              </div>
              <p className="mt-2 text-2xl font-bold">{formatCurrency(1200)}</p>
              <CardDescription>Tonight target</CardDescription>
            </Card>
            <Card className="bg-[#f4e9ff] p-4">
              <div className="flex items-center gap-2 text-[#6743b3]">
                <CalendarDays size={16} />
                <p className="text-xs uppercase">Scheduled</p>
              </div>
              <p className="mt-2 text-2xl font-bold">{today.length}</p>
              <CardDescription>Posts in queue</CardDescription>
            </Card>
            <Card className="bg-[#e9fbf3] p-4">
              <div className="flex items-center gap-2 text-[#1f7a5a]">
                <Wallet size={16} />
                <p className="text-xs uppercase">Open Leads</p>
              </div>
              <p className="mt-2 text-2xl font-bold">18</p>
              <CardDescription>DM replies to follow up</CardDescription>
            </Card>
          </div>
        </Card>

        <Countdown hours={5} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Today&apos;s Scheduled Posts</CardTitle>
          <CardDescription>Live and demo content pipeline</CardDescription>
          <div className="mt-4 grid gap-3">
            {today.map((post) => (
              <div key={post.id} className="rounded-2xl border border-[#f7cfe0] bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold capitalize">{post.platform.replace("_", " ")}</p>
                  <StatusBadge status={post.status} />
                </div>
                <p className="mt-2 text-sm text-[#5e3b4e]">{post.caption}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Business Idea Cards</CardTitle>
          <CardDescription>Fast-monetization projects to rotate this week</CardDescription>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {BUSINESSES.map((biz) => (
              <div key={biz.id} className="rounded-2xl bg-[#fff4f9] p-3">
                <p className="text-sm font-semibold">{biz.name}</p>
                <p className="text-xs text-[#7f536b]">{biz.niche}</p>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-4" asChild>
            <Link href="/launch-tonight">
              Open Launch Tonight <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </Card>
      </div>
    </section>
  );
}
