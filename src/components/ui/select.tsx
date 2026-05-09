import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-[#f6bfd7] bg-white px-3 text-sm text-[#2a1a24] outline-none focus:border-[#ef4f90]",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";
