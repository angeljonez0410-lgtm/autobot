"use client";

import { useMemo, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { DEMO_POSTS, BUSINESSES } from "@/lib/data";
import { PostStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

const statuses: PostStatus[] = ["idea", "draft", "ready", "scheduled", "posted"];

export default function CalendarPage() {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [board, setBoard] = useState(DEMO_POSTS);
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  const filtered = useMemo(() => {
    return board.filter((post) => {
      if (platformFilter !== "all" && post.platform !== platformFilter) return false;
      if (businessFilter !== "all" && post.businessId !== businessFilter) return false;
      return true;
    });
  }, [board, platformFilter, businessFilter]);

  function onDrop(postId: string, status: PostStatus) {
    setBoard((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p)));
  }

  return (
    <section className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Content Calendar</CardTitle>
            <CardDescription>Weekly/Monthly planning with drag-and-drop style status flow.</CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              className={`rounded-xl px-3 py-2 text-sm ${view === "weekly" ? "bg-[#ef4f90] text-white" : "bg-white"}`}
              onClick={() => setView("weekly")}
            >
              Weekly
            </button>
            <button
              className={`rounded-xl px-3 py-2 text-sm ${view === "monthly" ? "bg-[#ef4f90] text-white" : "bg-white"}`}
              onClick={() => setView("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
            <option value="all">All platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="youtube_shorts">YouTube Shorts</option>
          </Select>
          <Select value={businessFilter} onChange={(e) => setBusinessFilter(e.target.value)}>
            <option value="all">All businesses</option>
            {BUSINESSES.map((biz) => (
              <option key={biz.id} value={biz.id}>
                {biz.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {view === "monthly" ? (
        <Card>
          <CardTitle>Monthly Snapshot</CardTitle>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 28 }).map((_, i) => {
              const post = filtered[i % Math.max(filtered.length, 1)];
              return (
                <div key={i} className="min-h-24 rounded-2xl border border-[#f6cde0] bg-white p-2">
                  <p className="text-xs text-[#a26a88]">Day {i + 1}</p>
                  {post ? <p className="mt-1 line-clamp-2 text-xs">{post.caption}</p> : null}
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {statuses.map((status) => (
            <Card
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const postId = e.dataTransfer.getData("text/plain");
                onDrop(postId, status);
              }}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="capitalize">{status}</CardTitle>
                <StatusBadge status={status} />
              </div>
              <div className="mt-3 grid gap-2">
                {filtered
                  .filter((post) => post.status === status)
                  .map((post) => (
                    <div
                      key={post.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", post.id)}
                      className="cursor-grab rounded-xl border border-[#f8d6e6] bg-[#fff7fb] p-2 text-xs"
                    >
                      <p className="font-semibold capitalize">{post.platform.replace("_", " ")}</p>
                      <p className="line-clamp-3">{post.caption}</p>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
