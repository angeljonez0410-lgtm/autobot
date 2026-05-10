import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { BusinessProvider } from "@/lib/business-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { ToastProvider } from "@/components/toast-provider";
import { WelcomeToast } from "@/components/welcome-toast";
import { HelpButton } from "@/components/help-button";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Viral Boss Planner",
  description: "Social Media Automation Super Poster for fast-launch mompreneur businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <BusinessProvider>
          <ToastProvider>
            <WelcomeToast />
            <HelpButton />
            <ErrorBoundary>
              <AppShell>{children}</AppShell>
            </ErrorBoundary>
          </ToastProvider>
        </BusinessProvider>
      </body>
    </html>
  );
}
