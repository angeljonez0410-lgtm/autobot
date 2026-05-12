import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export function getHoursBetween(now: Date, target: Date) {
  return Math.max(0, Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60)));
}

// Simple sum function for testing
export function sum(a: number, b: number): number {
  return a + b;
}
