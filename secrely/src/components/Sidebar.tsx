"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MessageCircle, LayoutDashboard, User, Bell, Wallet, Settings, Shield, PlusSquare, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useCreditsStore } from "@/store/creditsStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LangToggle } from "@/components/LangToggle";
import { getInitials, formatCredits } from "@/lib/utils";
import { useT } from "@/hooks/useT";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { balance } = useCreditsStore();
  const { unreadCount } = useNotificationsStore();
  const t = useT().nav;

  const navItems = [
    { href: "/feed", icon: Home, label: t.home },
    { href: "/explore", icon: Compass, label: t.explore },
    { href: "/messages", icon: MessageCircle, label: t.messages },
    { href: "/notifications", icon: Bell, label: t.notifications, badge: true },
    { href: "/wallet", icon: Wallet, label: t.wallet },
    { href: "/dashboard", icon: LayoutDashboard, label: t.dashboard },
    { href: "/dashboard/new-post", icon: PlusSquare, label: t.newPost },
    { href: "/profile", icon: User, label: t.profile },
    { href: "/settings", icon: Settings, label: t.settings },
    { href: "/admin", icon: Shield, label: t.moderation },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 border-r border-border bg-white z-30 py-6 px-3">
      <Link href="/feed" className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl purple-gradient flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold tracking-tight">S</span>
        </div>
        <span className="font-display font-semibold text-lg text-foreground tracking-tight">Secrely</span>
      </Link>

      <nav className="flex-1 flex flex-col gap-0.5">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", isActive ? "bg-purple-50 text-[hsl(270,75%,60%)]" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
              <div className="relative">
                <Icon style={{ width: 18, height: 18 }} className={cn(isActive ? "stroke-[2.5px]" : "stroke-[1.75px]")} />
                {badge && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[hsl(270,75%,60%)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <Link href="/wallet" className="mx-0 mb-4 flex items-center gap-2.5 bg-purple-50 hover:bg-purple-100 rounded-xl px-3 py-3 transition-colors">
        <div className="w-8 h-8 rounded-lg purple-gradient flex items-center justify-center">
          <Coins className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{t.wallet}</div>
          <div className="text-sm font-semibold text-[hsl(270,75%,60%)] tabular-nums">{formatCredits(balance)}</div>
        </div>
      </Link>

      {/* Language toggle in sidebar */}
      <div className="flex items-center justify-between px-3 mb-3">
        <span className="text-xs text-muted-foreground font-medium">Language</span>
        <LangToggle />
      </div>

      <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors">
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.avatar} alt={user?.displayName} />
          <AvatarFallback className="text-xs">{user ? getInitials(user.displayName) : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{user?.displayName}</div>
          <div className="text-xs text-muted-foreground truncate">@{user?.username}</div>
        </div>
      </Link>
    </aside>
  );
}
