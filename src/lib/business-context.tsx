"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BusinessContextType {
  selectedBusinessId: string | null;
  setSelectedBusinessId: (id: string | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);


export function BusinessProvider({ children }: { children: ReactNode }) {
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<string | null>(null);

  // Persist to localStorage
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("selectedBusinessId") : null;
    if (stored) setSelectedBusinessIdState(stored);
  }, []);

  const setSelectedBusinessId = (id: string | null) => {
    setSelectedBusinessIdState(id);
    if (typeof window !== "undefined") {
      if (id) localStorage.setItem("selectedBusinessId", id);
      else localStorage.removeItem("selectedBusinessId");
    }
  };

  return (
    <BusinessContext.Provider value={{ selectedBusinessId, setSelectedBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within a BusinessProvider");
  return ctx;
}
