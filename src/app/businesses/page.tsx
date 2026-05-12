"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/lib/business-context";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

type Business = BusinessFormData & { id: string; archived?: boolean };

export default function BusinessesPage() {
  // Keyboard shortcut: N for new business
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "n" || e.key === "N") && (e.ctrlKey || e.metaKey)) {
        setShowForm(true);
        setEditing(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedBusinessId, setSelectedBusinessId } = useBusiness();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  // Fetch businesses for user
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBusinesses(data || []);
        setLoading(false);
      });
  }, [user]);

  async function handleSave(data: BusinessFormData) {
    setLoading(true);
    if (!user) return;
    let firstBusiness = false;
    if (!editing && businesses.length === 0) firstBusiness = true;
    if (editing) {
      // Update
      await supabase.from("businesses").update({ ...data }).eq("id", editing.id);
    } else {
      // Insert
      await supabase.from("businesses").insert([{ ...data, user_id: user.id }]);
    }
    // Refresh
    const { data: refreshed } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setBusinesses(refreshed || []);
    setShowForm(false);
    setEditing(null);
    setLoading(false);
    if (firstBusiness) router.push("/onboarding/complete");
  }

  async function handleArchive(id: string) {
    if (!window.confirm("Are you sure you want to archive this business? You can restore it later from the archived list.")) return;
    setLoading(true);
    await supabase.from("businesses").update({ archived: true }).eq("id", id);
    setBusinesses(bs => bs.map(b => b.id === id ? { ...b, archived: true } : b));
    setLoading(false);
  }

  async function handleRestore(id: string) {
    if (!window.confirm("Restore this business from archive?")) return;
    setLoading(true);
    await supabase.from("businesses").update({ archived: false }).eq("id", id);
    setBusinesses(bs => bs.map(b => b.id === id ? { ...b, archived: false } : b));
    setLoading(false);
  }

  function handleSwitch(id: string) {
    setSelectedBusinessId(id);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Businesses</h1>
      <div className="mb-6 flex justify-center">
        <button
          className="bg-gradient-to-r from-pink-300 to-purple-300 text-black font-bold px-4 py-2 rounded-xl shadow"
          onClick={() => { setShowForm(true); setEditing(null); }}
        >
          Add Business
        </button>
      </div>
      {showForm && (
        <div className="mb-8 p-4 rounded-2xl bg-white/90 border border-pink-200 shadow">
          <BusinessForm
            initial={editing || undefined}
            onSubmit={handleSave}
            loading={loading}
          />
        </div>
      )}
      <div className="grid gap-4">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && businesses.length === 0 && <div className="text-center text-gray-400">No businesses yet.</div>}
        {businesses.filter(b => !b.archived).map(biz => (
          <div key={biz.id} className={`rounded-xl border-2 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${selectedBusinessId === biz.id ? "border-pink-400 bg-pink-50" : "border-pink-200 bg-white"}`}>
            <div>
              <div className="font-bold text-lg text-purple-700">{biz.name}</div>
              <div className="text-xs text-pink-500">{biz.type}</div>
              <div className="text-xs text-gray-500">{biz.brand_voice}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 rounded bg-purple-200 hover:bg-purple-300" onClick={() => { setEditing(biz); setShowForm(true); }}>Edit</button>
              <button className="text-xs px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200" onClick={() => handleSwitch(biz.id)}>{selectedBusinessId === biz.id ? "Selected" : "Switch"}</button>
              <button className="text-xs px-3 py-1 rounded bg-pink-100 hover:bg-pink-200" onClick={() => handleArchive(biz.id)}>Archive</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-pink-400 mb-2">Archived</h2>
        <div className="grid gap-2">
          {businesses.filter(b => b.archived).length === 0 && <div className="text-xs text-gray-400">No archived businesses.</div>}
          {businesses.filter(b => b.archived).map(biz => (
            <div key={biz.id} className="rounded-xl border border-pink-100 bg-gray-50 p-3 flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-500">{biz.name}</span>
                <span className="ml-2 text-xs text-gray-400">{biz.type}</span>
              </div>
              <button className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200" onClick={() => handleRestore(biz.id)}>Restore</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}