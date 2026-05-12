"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useBusiness } from "@/lib/business-context";

export default function AutomationPage() {
  // Keyboard shortcut: N for new automation rule
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.key === "n" || e.key === "N") && (e.ctrlKey || e.metaKey)) {
        const input = document.querySelector<HTMLInputElement>("input[placeholder^='Describe your automation rule']");
        if (input) input.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const { user, loading: authLoading } = useUser();
  type AutomationRule = {
    id: string;
    user_id: string;
    business_id: string;
    description: string;
    created_at: string;
  };
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [newRule, setNewRule] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { selectedBusinessId } = useBusiness();
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login";
  }, [user, authLoading]);

  // Fetch automation rules for user & business
  useEffect(() => {
    if (!user || !selectedBusinessId) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("automation_rules")
        .select("*")
        .eq("user_id", user.id)
        .eq("business_id", selectedBusinessId)
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      setRules(data || []);
      setLoading(false);
    })();
  }, [user, selectedBusinessId]);

  async function handleAddRule() {
    setError("");
    setFormError("");
    if (!newRule.trim()) {
      setFormError("Rule description is required.");
      return;
    }
    if (!user || !selectedBusinessId) return;
    setLoading(true);
    const { error } = await supabase.from("automation_rules").insert([
      {
        user_id: user.id,
        business_id: selectedBusinessId,
        rule: newRule,
        active: true,
      },
    ]);
    if (error) setError(error.message);
    setNewRule("");
    // Refresh
    const { data } = await supabase
      .from("automation_rules")
      .select("*")
      .eq("user_id", user.id)
      .eq("business_id", selectedBusinessId)
      .order("created_at", { ascending: false });
    setRules(data || []);
    setLoading(false);
  }

  async function handleToggleActive(id: string, active: boolean) {
    setLoading(true);
    await supabase.from("automation_rules").update({ active: !active }).eq("id", id);
    setRules(rules => rules.map(r => r.id === id ? { ...r, active: !active } : r));
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this automation rule? This cannot be undone.")) return;
    setLoading(true);
    await supabase.from("automation_rules").delete().eq("id", id);
    setRules(rules => rules.filter(r => r.id !== id));
    setLoading(false);
  }

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;
  if (!selectedBusinessId) return <div className="text-center py-12 text-pink-400">Select a business to manage automation rules.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Automation Rules</h1>
      <div className="mb-6 flex flex-col gap-2">
        {formError && <div className="text-pink-500 text-sm text-center">{formError}</div>}
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={e => setNewRule(e.target.value)}
            placeholder="Describe your automation rule (e.g. auto-approve posts on Friday)"
            className="flex-1"
            helperText="Example: Auto-approve posts on Friday, auto-archive after 7 days, etc."
          />
          <Button onClick={handleAddRule} disabled={loading}>Add Rule</Button>
        </div>
      </div>
      {error && <div className="text-center text-pink-500 mb-4">{error}</div>}
      <div className="grid gap-4">
        {loading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!loading && rules.length === 0 && <div className="text-center text-gray-400">No automation rules yet.</div>}
        {rules.map(rule => (
          <Card key={rule.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle>{rule.rule}</CardTitle>
              <CardDescription>Status: {rule.active ? "Active" : "Inactive"}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleToggleActive(rule.id, rule.active)}>
                {rule.active ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="outline" onClick={() => handleDelete(rule.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}