"use client";

import { useMemo, useState, useEffect } from "react";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { BUSINESSES } from "@/lib/data";
import { Spinner } from "@/components/ui/spinner";
import { useBusiness } from "@/lib/business-context";
import { PostStatus } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

const statuses: PostStatus[] = ["idea", "draft", "ready", "scheduled", "posted"];

export default function CalendarPage() {

  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { selectedBusinessId } = useBusiness();
  const [businessFilter, setBusinessFilter] = useState<string>(selectedBusinessId || "all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Sync businessFilter with selectedBusinessId
  useEffect(() => {
    setBusinessFilter(selectedBusinessId || "all");
  }, [selectedBusinessId]);

  // Fetch posts from Supabase
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let query = supabase.from("posts").select("*").eq("user_id", user.id);
    if (businessFilter !== "all") query = query.eq("business_id", businessFilter);
    query.order("created_at", { ascending: false }).then(({ data }) => {
      setPosts(data || []);
      setLoading(false);
    });
  }, [user, businessFilter]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      if (platformFilter !== "all" && post.platform !== platformFilter) return false;
      if (businessFilter !== "all" && post.business_id !== businessFilter) return false;
      return true;
    });
  }, [posts, platformFilter, businessFilter]);

  async function onDrop(postId: string, status: PostStatus) {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status } : p)));
    await supabase.from("posts").update({ status }).eq("id", postId);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

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
