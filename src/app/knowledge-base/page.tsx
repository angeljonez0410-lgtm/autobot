"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useBusiness } from "@/lib/business-context";

export default function KnowledgeBasePage() {
  // Keyboard shortcut: N for new knowledge base entry
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "n" || e.key === "N") && (e.ctrlKey || e.metaKey)) {
        const input = document.querySelector<HTMLInputElement>("input[placeholder^='Type (e.g. FAQ']");
        if (input) input.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const { user, loading: authLoading } = useUser();
  const [entries, setEntries] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { selectedBusinessId } = useBusiness();
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login";
  }, [user, authLoading]);

  // Fetch knowledge base entries for user & business
  useEffect(() => {
    if (!user || !selectedBusinessId) return;
    setLoading(true);
    supabase
      .from("knowledge_base")
      .select("*")
      .eq("user_id", user.id)
      .eq("business_id", selectedBusinessId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setEntries(data || []);
        setLoading(false);
      });
  }, [user, selectedBusinessId]);

  async function handleAddEntry() {
    setError("");
    setFormError("");
    if (!type.trim()) {
      setFormError("Type is required.");
      return;
    }
    if (!content.trim()) {
      setFormError("Content is required.");
      return;
    }
    if (!user || !selectedBusinessId) return;
    setLoading(true);
    const { error } = await supabase.from("knowledge_base").insert([
      {
        user_id: user.id,
        business_id: selectedBusinessId,
        type,
        content,
      },
    ]);
    if (error) setError(error.message);
    setType("");
    setContent("");
    // Refresh
    const { data } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("user_id", user.id)
      .eq("business_id", selectedBusinessId)
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this entry? This cannot be undone.")) return;
    setLoading(true);
    await supabase.from("knowledge_base").delete().eq("id", id);
    setEntries(entries => entries.filter(e => e.id !== id));
    setLoading(false);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!selectedBusinessId) return <div className="text-center py-12 text-pink-400">Select a business to manage the knowledge base.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Knowledge Base</h1>
      <div className="mb-6 grid gap-2">
        {formError && <div className="text-pink-500 text-sm text-center">{formError}</div>}
        <Input
          value={type}
          onChange={e => setType(e.target.value)}
          placeholder="Type (e.g. FAQ, SOP, Brand Voice, etc.)"
          helperText="What kind of entry is this? (e.g. FAQ, SOP, Brand Voice)"
        />
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Content"
          helperText="Add the details, instructions, or information for this entry."
        />
        <Button onClick={handleAddEntry} disabled={loading}>Add Entry</Button>
      </div>
      {error && <div className="text-center text-pink-500 mb-4">{error}</div>}
      <div className="grid gap-4">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && entries.length === 0 && <div className="text-center text-gray-400">No knowledge base entries yet.</div>}
        {entries.map(entry => (
          <Card key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>{entry.type}</CardTitle>
              <CardDescription className="whitespace-pre-line">{entry.content}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => handleDelete(entry.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}