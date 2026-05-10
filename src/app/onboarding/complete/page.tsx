import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingCompletePage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <Card className="p-8">
        <CardTitle>You're All Set!</CardTitle>
        <CardDescription className="mb-4 mt-2">
          Your first business profile is created. Next, you can add products, generate content, and automate your workflow. Explore the dashboard to get started!
        </CardDescription>
        <Button asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
      </Card>
    </div>
  );
}
