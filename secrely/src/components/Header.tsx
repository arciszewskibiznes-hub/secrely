"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Coins, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useCreditsStore } from "@/store/creditsStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { getInitials, formatCredits } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Header() {
  const { user } = useAuthStore();
  const { balance } = useCreditsStore();
  const { unreadCount } = useNotificationsStore();
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/feed") return "Home";
    if (pathname === "/explore") return "Explore";
    if (pathname === "/messages") return "Messages";
    if (pathname === "/notifications") return "Notifications";
    if (pathname === "/wallet") return "Wallet";
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/settings") return "Settings";
    if (pathname === "/admin") return "Moderation";
    if (pathname === "/profile") return "Profile";
    if (pathname?.startsWith("/creator/")) return "Creator";
    return "Secrely";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo / Title */}
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg purple-gradient flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold tracking-tight">S</span>
          </div>
          <span
            className={cn(
              "font-display font-semibold text-foreground tracking-tight",
              pathname === "/feed" ? "hidden sm:block" : "block"
            )}
          >
            {getTitle()}
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Credit balance */}
          <Link
            href="/wallet"
            className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full px-3 py-1.5 transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold tabular-nums">{formatCredits(balance)}</span>
          </Link>

          {/* Search (explore only shows on desktop sidebar) */}
          <Link
            href="/explore"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground sm:hidden"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[hsl(270,75%,60%)] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <Link href="/profile">
            <Avatar className="w-8 h-8 ring-2 ring-purple-100 hover:ring-purple-300 transition-all">
              <AvatarImage src={user?.avatar} alt={user?.displayName} />
              <AvatarFallback className="text-xs">
                {user ? getInitials(user.displayName) : "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
