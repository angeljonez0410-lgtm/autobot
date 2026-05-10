"use client";
import { useToast } from "@/components/toast-provider";
import { useEffect } from "react";

export function WelcomeToast() {
  const { showToast } = useToast();
  useEffect(() => {
    if (typeof window !== "undefined" && !window.__welcomed) {
      showToast("Welcome to your AI business OS! Need help? Click the help button.", "success");
      window.__welcomed = true;
    }
  }, [showToast]);
  return null;
}
