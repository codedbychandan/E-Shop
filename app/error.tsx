"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 mb-6">
        <AlertTriangle size={36} />
      </div>

      <h1 className="heading-2">Something went wrong</h1>
      <p className="mt-3 max-w-md text-base text-muted leading-relaxed">
        An unexpected error occurred while processing this page. You can try refreshing the component or return to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => reset()} className="btn-primary h-11 px-6">
          <RefreshCw size={16} /> Try Again
        </button>
        <Link href="/" className="btn-outline h-11 px-6">
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
