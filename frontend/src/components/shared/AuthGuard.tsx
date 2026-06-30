"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const publicRoutes = ["/login", "/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
    } else if (isAuthenticated && isPublicRoute) {
      router.push("/");
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If waiting for redirect, we can also return null or the loading spinner
  // to avoid flashing protected content to unauthenticated users or vice versa
  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isAuthenticated && !isPublicRoute) return null;
  if (isAuthenticated && isPublicRoute) return null;

  return <>{children}</>;
}
