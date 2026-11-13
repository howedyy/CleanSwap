"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface QuoteContextValue {
  /** Scroll to the contact form with a pre-filled subject (e.g. from a service package). */
  requestQuote: (subject: string) => void;
  quoteRequest: { subject: string; nonce: number } | null;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteRequest, setQuoteRequest] = useState<QuoteContextValue["quoteRequest"]>(null);

  const requestQuote = useCallback((subject: string) => {
    setQuoteRequest((q) => ({ subject, nonce: (q?.nonce ?? 0) + 1 }));
    // Give any open dialog a moment to release its scroll lock before scrolling.
    window.setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }, []);

  const value = useMemo(() => ({ requestQuote, quoteRequest }), [requestQuote, quoteRequest]);

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
