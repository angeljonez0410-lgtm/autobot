"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, CalendarDays, Sparkles, PenLine, Zap, HandCoins, ChartNoAxesCombined, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: Rocket },
  { href: "/calendar", label: "Content Calendar", icon: CalendarDays },
  { href: "/generator", label: "AI Generator", icon: Sparkles },
  { href: "/composer", label: "Post Composer", icon: PenLine },
  { href: "/launch-tonight", label: "Launch Tonight", icon: Zap },
  { href: "/ideas", label: "Money Ideas", icon: HandCoins },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#ffe4ef_0%,#fff9fc_45%,#fff7ef_100%)] text-[#2a1a24]">
      <header className="border-b border-[#f8cfe0] bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c86a93]">Viral Boss Planner</p>
            <h1 className="text-xl font-semibold">Social Media Automation Super Poster</h1>
          </div>
          <span className="rounded-full bg-[#1b1721] px-3 py-1 text-xs font-semibold text-[#ffd27f]">Launch-Ready MVP</span>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-3xl border border-[#f5c9dc] bg-white/90 p-3 shadow-sm">
          <nav className="grid gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition",
                    active ? "bg-[#ef4f90] text-white" : "text-[#62314a] hover:bg-[#fff2f8]",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
