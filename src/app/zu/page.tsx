"use client";
import { useState } from "react";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { useBusiness } from "@/lib/business-context";

export default function ZuPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [formError, setFormError] = useState("");

  const { selectedBusinessId } = useBusiness();
  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }
  if (!selectedBusinessId) {
    return <div className="text-center py-12 text-pink-400">Select a business to use Zu AI Assistant.</div>;
  }

  async function handleAskZu() {
    setFormError("");
    if (!prompt.trim()) {
      setFormError("Prompt is required.");
      return;
    }
    setLoading(true);
    setResponse("");
    setSaveStatus("");
    // Call your AI API endpoint
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResponse(data.text || "No response");
    setLoading(false);
  }

  async function handleSaveDraft() {
    setSaveStatus("");
    if (!user || !selectedBusinessId || !response) return;
    setLoading(true);
    const { error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        business_id: selectedBusinessId,
        content: response,
        status: "draft",
      },
    ]);
    if (error) setSaveStatus(error.message);
    else setSaveStatus("Draft saved!");
    setLoading(false);
  }

  async function handleSendToApproval() {
    setSaveStatus("");
    if (!user || !selectedBusinessId || !response) return;
    setLoading(true);
    const { data: postData, error: postError } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        business_id: selectedBusinessId,
        content: response,
        status: "generated",
      },
    ]).select();
    if (postError || !postData?.[0]) {
      setSaveStatus(postError?.message || "Failed to save post");
      setLoading(false);
      return;
    }
    const post_id = postData[0].id;
    const { error: queueError } = await supabase.from("approval_queue").insert([
      {
        post_id,
        status: "generated",
      },
    ]);
    if (queueError) setSaveStatus(queueError.message);
    else setSaveStatus("Sent to approval queue!");
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Zu AI Assistant</h1>
      {formError && <div className="text-pink-500 text-sm text-center">{formError}</div>}
      <Textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Ask Zu to generate content, a plan, or a recommendation..."
        className="mb-4"
      />
      <Button onClick={handleAskZu} disabled={loading || !prompt} className="mb-4">
        {loading ? <span className="flex items-center gap-2"><Spinner className="w-4 h-4" /> Thinking...</span> : "Ask Zu"}
      </Button>
      {response && (
        <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-pink-200">
          <div className="font-bold text-purple-700 mb-2">Zu says:</div>
          <div className="whitespace-pre-line text-sm">{response}</div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveDraft} disabled={loading || !response || loading}>
              {loading ? <span className="flex items-center gap-2"><Spinner className="w-4 h-4" /> Saving...</span> : "Save as Draft"}
            </Button>
            <Button onClick={handleSendToApproval} disabled={loading || !response || loading}>
              {loading ? <span className="flex items-center gap-2"><Spinner className="w-4 h-4" /> Sending...</span> : "Send to Approval Queue"}
            </Button>
          </div>
          {saveStatus && <div className="mt-2 text-center text-pink-500">{saveStatus}</div>}
        </div>
      )}
    </div>
  );
}