"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const PLANS = [
  { name: "Free", price: 0, features: ["1 business", "10 posts/month", "Basic AI"] },
  { name: "Pro", price: 19, features: ["3 businesses", "100 posts/month", "Advanced AI", "Automation"] },
  { name: "Boss", price: 49, features: ["Unlimited businesses", "Unlimited posts", "All features", "Priority support"] },
];

export default function PricingPage() {
  const { user, loading: authLoading } = useUser();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) window.location.href = "/login";
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setSubscription(data?.[0] || null);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || !user) return <div className="text-center py-12 text-pink-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-500">Pricing & Plans</h1>
      {error && <div className="text-center text-pink-500 mb-4">{error}</div>}
      <div className="mb-8">
        <Card>
          <CardTitle>Your Plan</CardTitle>
          {loading ? (
            <CardDescription>Loading...</CardDescription>
          ) : subscription ? (
            <>
              <CardDescription>Plan: {subscription.plan}</CardDescription>
              <CardDescription>Status: {subscription.status}</CardDescription>
              <CardDescription>Expires: {subscription.expires_at ? new Date(subscription.expires_at).toLocaleDateString() : "Never"}</CardDescription>
            </>
          ) : (
            <CardDescription>No active subscription. You are on the Free plan.</CardDescription>
          )}
        </Card>
      </div>
      <div className="grid gap-6">
        {PLANS.map(plan => (
          <Card key={plan.name} className="p-6 flex flex-col gap-2">
            <CardTitle>{plan.name} {plan.price > 0 && <span className="text-pink-400">${plan.price}/mo</span>}</CardTitle>
            <ul className="list-disc ml-6 text-sm text-[#7f536b]">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="mt-2 bg-pink-400 text-white rounded-xl px-4 py-2 font-bold" disabled>
              {plan.name === (subscription?.plan || "Free") ? "Current Plan" : "Upgrade (Coming Soon)"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}