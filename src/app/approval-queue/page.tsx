"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ApprovalActions } from "@/components/approval-actions";
import { Spinner } from "@/components/ui/spinner";

import { useBusiness } from "@/lib/business-context";

type ApprovalItem = {
  id: string;
  post_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  post?: {
    content: string;
    platform: string;
    status: string;
    scheduled_at: string;
  };
};

export default function ApprovalQueuePage() {
  const { selectedBusinessId } = useBusiness();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [queue, setQueue] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Fetch approval queue for selected business
  useEffect(() => {
    if (!user || !selectedBusinessId) return;
    (async () => {
      setLoading(true);
      if (!supabase) {
        setQueue([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("approval_queue")
        .select("*, post:posts(*)")
        .eq("user_id", user.id)
        .eq("business_id", selectedBusinessId)
        .order("created_at", { ascending: false });
      setQueue(data || []);
      setLoading(false);
    })();
  }, [user, selectedBusinessId]);

  async function updateStatus(id: string, status: string) {
    setLoading(true);
    await supabase.from("approval_queue").update({ status }).eq("id", id);
    setQueue(q => q.map(item => item.id === id ? { ...item, status } : item));
    setLoading(false);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!selectedBusinessId) return <div className="text-center py-12 text-pink-400">Select a business to view approval queue.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Approval Queue</h1>
      <div className="grid gap-4">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && queue.length === 0 && <div className="text-center text-gray-400">No items in approval queue.</div>}
        {queue.map(item => (
          <div key={item.id} className="rounded-xl border-2 p-4 bg-white border-pink-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="font-bold text-lg text-purple-700">{item.post?.platform || "Unknown Platform"}</div>
                <div className="text-xs text-gray-500 mb-2">{item.post?.content?.slice(0, 120) || "No content"}</div>
                <div className="text-xs text-pink-500">Status: {item.status}</div>
              </div>
              <ApprovalActions
                status={item.status}
                onApprove={() => updateStatus(item.id, "approved")}
                onEdit={() => {}}
                onReject={() => updateStatus(item.id, "rejected")}
                onSchedule={() => updateStatus(item.id, "scheduled")}
                onArchive={() => updateStatus(item.id, "archived")}
                onDuplicate={() => {}}
                onTemplate={() => {}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}