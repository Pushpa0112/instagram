"use client";

import { useAuthStore } from "@/store/useAuthStore";
import SuggestedUsers from "@/components/shared/SuggestedUsers";

export default function MainPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex justify-center max-w-5xl mx-auto w-full">
      {/* Main Feed Column */}
      <div className="flex-1 max-w-[630px] pt-10 px-4 sm:px-0 lg:ml-12">
        <h1 className="text-xl font-bold mb-6">Home</h1>
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl p-8 text-center text-gray-500">
          <p>You are logged in as <strong>{user?.username}</strong>.</p>
          <p className="mt-2 text-sm">Posts feed will be implemented here in Phase 2.</p>
        </div>
      </div>

      {/* Suggested Users Column */}
      <SuggestedUsers />
    </div>
  );
}
