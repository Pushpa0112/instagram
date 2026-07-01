"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, Menu, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/features/auth/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "#", icon: Search },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Notifications", href: "/notifications", icon: Heart },
  { name: "Create", href: "#", icon: PlusSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-black border-r border-gray-300 dark:border-zinc-800 p-4 pt-8 transition-all">
      <div className="mb-10 px-2">
        <Link href="/">
          <h1 className="font-serif text-2xl font-bold tracking-tighter italic hidden lg:block">Instagram</h1>
          {/* Add a smaller logo icon for mobile/collapsed state if desired */}
          <div className="lg:hidden text-xl font-bold">Ig</div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group ${isActive ? "font-bold" : ""
                }`}
            >
              <Icon
                className={`w-6 h-6 transition-transform group-hover:scale-105 ${isActive ? "stroke-[2.5]" : "stroke-2"
                  }`}
              />
              <span className="hidden lg:block text-base">{item.name}</span>
            </Link>
          );
        })}

        {/* Profile Link */}
        <Link
          href={user ? `/${user.username}` : "#"}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group ${pathname === `/${user?.username}` ? "font-bold" : ""
            }`}
        >
          <Avatar className="w-6 h-6 border border-gray-200 dark:border-zinc-800 transition-transform group-hover:scale-105">
            <AvatarImage src={user?.profilePicture || ""} alt={user?.username || "Profile"} />
            <AvatarFallback className="text-[10px] uppercase">
              {user?.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:block text-base">Profile</span>
        </Link>
      </nav>

      {/* Bottom Menu */}
      <div className="mt-auto space-y-2">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group text-red-500"
        >
          <LogOut className="w-6 h-6 transition-transform group-hover:scale-105" />
          <span className="hidden lg:block text-base font-medium">Logout</span>
        </button>

        <button className="flex w-full items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors group">
          <Menu className="w-6 h-6 transition-transform group-hover:scale-105" />
          <span className="hidden lg:block text-base">More</span>
        </button>
      </div>
    </div>
  );
}
