"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // To avoid hydration mismatch errors, we only render children after mounting
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isPublicRoute = pathname === "/login" || pathname === "/register";

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, pathname, isMounted, router]);

  // Optionally show a loading spinner while mounting or checking auth state
  if (!isMounted) {
    return null; // Or a sleek Instagram-style loading spinner
  }

  // Prevent flashing of protected content if not authenticated and trying to access a protected route
  const isPublicRoute = pathname === "/login" || pathname === "/register";
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }
  
  // Prevent flashing of public content if authenticated and trying to access a public route
  if (isAuthenticated && isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
