"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { useBusiness } from "@/lib/business-context";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const { user, loading: authLoading } = useUser();
  const { selectedBusinessId } = useBusiness();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (selectedBusinessId) router.push("/");
  }, [user, authLoading, selectedBusinessId, router]);

  return (
    <div className="max-w-xl mx-auto py-12">
      <Card className="p-8">
        <CardTitle>Welcome to Autobot!</CardTitle>
        <CardDescription className="mb-4 mt-2">
          Let’s get your AI business system set up. Start by creating your first business profile. You’ll be guided through the essential steps to launch and automate your content, products, and workflows.
        </CardDescription>
        <Button href="/businesses" asChild>
          <a>Create Your First Business</a>
        </Button>
      </Card>
    </div>
  );
}
