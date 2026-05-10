import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  helperText?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, helperText, ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[#f6bfd7] bg-white px-3 text-sm text-[#2a1a24] outline-none ring-0 placeholder:text-[#a26a88] focus:border-[#ef4f90]",
          className,
        )}
        {...props}
      />
      {helperText && (
        <div className="absolute left-0 mt-1 text-xs text-[#a26a88] bg-white bg-opacity-80 px-2 py-1 rounded shadow z-10">
          {helperText}
        </div>
      )}
    </div>
  ),
);
Input.displayName = "Input";
