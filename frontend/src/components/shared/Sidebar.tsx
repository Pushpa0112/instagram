"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Compass, 
  Video, 
  MessageCircle, 
  Heart, 
  Menu,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePostTrigger from "./CreatePostTrigger";
import { useLogout } from "@/features/auth/hooks";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { toggleSearch, isSearchOpen } = useUIStore();
  const logout = useLogout();

  const navItems = [
    { name: "Home", href: "/", icon: Home, isActive: pathname === "/" },
    { name: "Search", action: toggleSearch, icon: Search, isActive: isSearchOpen },
    { name: "Explore", href: "/explore", icon: Compass, isActive: pathname === "/explore" },
    { name: "Reels", href: "/reels", icon: Video, isActive: pathname === "/reels" },
    { name: "Messages", href: "/messages", icon: MessageCircle, isActive: pathname.startsWith("/messages") },
    { name: "Notifications", href: "/notifications", icon: Heart, isActive: pathname === "/notifications" },
  ];

  return (
    <div className="hidden md:flex flex-col w-[72px] lg:w-64 h-screen fixed left-0 top-0 border-r dark:border-zinc-800 bg-white dark:bg-black z-50 transition-all duration-300 py-2">
      {/* Logo */}
      <div className="p-4 lg:p-6 mb-2">
        <Link href="/" className="block">
          <span className="hidden lg:block font-serif text-2xl italic font-semibold">Instagram</span>
          <span className="lg:hidden block hover:scale-105 transition-transform">
            {/* Instagram Icon Placeholder */}
            <svg aria-label="Instagram" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          item.href ? (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group",
                item.isActive ? "font-bold" : "font-normal"
              )}
            >
              <item.icon className={cn("w-6 h-6 group-hover:scale-105 transition-transform", item.isActive && "stroke-[2.5]")} />
              <span className="hidden lg:block text-base">{item.name}</span>
            </Link>
          ) : (
            <button
              key={item.name}
              onClick={item.action}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group w-full",
                item.isActive ? "font-bold" : "font-normal"
              )}
            >
              <item.icon className={cn("w-6 h-6 group-hover:scale-105 transition-transform", item.isActive && "stroke-[2.5]")} />
              <span className="hidden lg:block text-base">{item.name}</span>
            </button>
          )
        ))}

        <CreatePostTrigger />

        {/* Profile */}
        <Link 
          href={user ? `/profile/${user._id}` : "#"}
          className={cn(
            "flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group",
            pathname.startsWith("/profile") ? "font-bold" : "font-normal"
          )}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 border group-hover:scale-105 transition-transform">
            {user ? (
              user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase">
                  {user.username.charAt(0)}
                </div>
              )
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
          <span className="hidden lg:block text-base">Profile</span>
        </Link>
      </div>

      {/* More Menu & Logout */}
      <div className="p-3 mt-auto flex flex-col gap-1">
        <button 
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-500 transition-colors group w-full text-left"
        >
          <LogOut className="w-6 h-6 group-hover:scale-105 transition-transform" />
          <span className="hidden lg:block text-base">Logout</span>
        </button>
        <button className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group w-full text-left">
          <Menu className="w-6 h-6 group-hover:scale-105 transition-transform" />
          <span className="hidden lg:block text-base">More</span>
        </button>
      </div>
    </div>
  );
}
