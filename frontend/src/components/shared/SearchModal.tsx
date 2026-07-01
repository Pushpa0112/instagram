"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchUsers } from "@/features/search/mock";

export default function SearchModal() {
  const { isSearchOpen, toggleSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        const data = await searchUsers(query);
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* Mobile full-screen modal or desktop slide-over */}
      <div 
        className={`fixed inset-y-0 left-0 md:left-[72px] lg:left-64 z-40 bg-white dark:bg-zinc-950 border-r dark:border-zinc-800 shadow-2xl transition-transform duration-300 w-full md:w-[400px] flex flex-col
          ${isSearchOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-[150%]"}
        `}
      >
        <div className="p-4 md:p-6 border-b dark:border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-semibold">Search</h2>
             <button onClick={toggleSearch} className="md:hidden p-1 text-gray-500 hover:text-black dark:hover:text-white">
                <X className="w-6 h-6" />
             </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              placeholder="Search" 
              className="pl-9 bg-gray-100 dark:bg-zinc-900 border-none rounded-lg h-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-3 top-3 bg-gray-300 dark:bg-zinc-700 rounded-full p-[2px] text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                 </div>
               ))}
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer">
                   <div className="w-11 h-11 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-500">
                     {user.username.charAt(0).toUpperCase()}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-semibold text-sm">{user.username}</span>
                     <span className="text-gray-500 dark:text-gray-400 text-sm">{user.fullName}</span>
                   </div>
                </div>
              ))}
            </div>
          ) : query ? (
            <p className="text-gray-500 text-center mt-4">No results found.</p>
          ) : (
            <p className="text-gray-500 text-center mt-4">Recent searches will appear here.</p>
          )}
        </div>
      </div>
      
      {/* Backdrop for mobile */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={toggleSearch}
        />
      )}
    </>
  );
}
