import React from "react";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-4 border-pink-300 border-t-pink-500 ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
