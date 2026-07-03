"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white dark:bg-black">
      <div className="w-24 h-24 rounded-full border-4 border-red-500/20 bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        We encountered an unexpected error while processing your request. Please try again.
      </p>
      
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
