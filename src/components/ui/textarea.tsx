import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[110px] w-full rounded-xl border border-[#f6bfd7] bg-white px-3 py-2 text-sm text-[#2a1a24] outline-none placeholder:text-[#a26a88] focus:border-[#ef4f90]",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
