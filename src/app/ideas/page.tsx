import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MONEY_IDEAS } from "@/lib/data";

export default function IdeasPage() {
  return (
    <section className="grid gap-5">
      <Card>
        <CardTitle>Money-Making Ideas</CardTitle>
        <CardDescription>Legal, realistic, fast-start ideas for your current businesses.</CardDescription>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MONEY_IDEAS.map((idea, idx) => (
          <Card key={idea} className={idx % 2 === 0 ? "bg-[#fff5fa]" : "bg-[#fff9ef]"}>
            <CardTitle className="text-base">Idea {idx + 1}</CardTitle>
            <CardDescription className="mt-2">{idea}</CardDescription>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-sm text-[#6a4054]">
          Safety note: For food sales and business services, verify local licensing, tax, and health requirements before taking paid orders.
        </p>
      </Card>
    </section>
  );
}
