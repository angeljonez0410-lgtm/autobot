import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LAUNCH_CHECKLIST, MONEY_IDEAS, PRELOADED_LAUNCH_POSTS } from "@/lib/data";

export default function LaunchTonightPage() {
  return (
    <section className="grid gap-5">
      <Card>
        <CardTitle>Launch Tonight Mode</CardTitle>
        <CardDescription>5-hour sprint plan for immediate momentum.</CardDescription>
        <div className="mt-4 max-w-sm">
          <Countdown hours={5} />
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle>Step-by-Step Checklist</CardTitle>
          <ul className="mt-3 grid gap-2 text-sm">
            {LAUNCH_CHECKLIST.map((item, idx) => (
              <li key={item} className="rounded-xl bg-[#fff5fa] p-3">
                <span className="font-semibold">Step {idx + 1}:</span> {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardTitle>Emergency Money Ideas</CardTitle>
          <div className="mt-3 grid gap-2 text-sm">
            {MONEY_IDEAS.slice(0, 6).map((idea) => (
              <p key={idea} className="rounded-xl bg-[#fff6d8] p-3">
                {idea}
              </p>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-[#1b1721] p-3 text-sm text-[#ffd27f]">
            Daily posting plan: 3 short videos, 2 story posts, 2 marketplace offers, 1 email promo.
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>20 Preloaded Posts Ready To Customize</CardTitle>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRELOADED_LAUNCH_POSTS.map((post) => (
            <div key={post.id} className="rounded-2xl border border-[#f9d8e7] bg-white p-3">
              <p className="text-xs uppercase text-[#a26a88]">{post.platform.replace("_", " ")}</p>
              <p className="mt-1 text-sm font-semibold">{post.title}</p>
              <p className="mt-1 text-sm text-[#5f3a4f]">{post.text}</p>
              <Button variant="outline" className="mt-2 h-8">Post now</Button>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
