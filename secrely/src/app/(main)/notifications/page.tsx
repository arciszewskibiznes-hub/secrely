"use client";

import { motion } from "motion/react";
import { Heart, MessageCircle, UserPlus, Lock, Zap, DollarSign, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNotificationsStore } from "@/store/notificationsStore";
import { timeAgo, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

const iconMap: Record<Notification["type"], { icon: React.ElementType; color: string; bg: string }> = {
  like: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50" },
  follow: { icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-50" },
  unlock: { icon: Lock, color: "text-[hsl(270,75%,60%)]", bg: "bg-purple-50" },
  new_post: { icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  tip: { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
};

export default function NotificationsPage() {
  const { notifications, markAllRead, markRead, unreadCount } = useNotificationsStore();

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">{unreadCount} unread</span>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs gap-1.5">
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">New</h3>
          <div className="card-base divide-y divide-border overflow-hidden">
            {unread.map((notif, i) => (
              <NotifItem key={notif.id} notif={notif} onRead={() => markRead(notif.id)} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Earlier</h3>
          <div className="card-base divide-y divide-border overflow-hidden">
            {read.map((notif, i) => (
              <NotifItem key={notif.id} notif={notif} onRead={() => {}} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotifItem({ notif, onRead, index }: { notif: Notification; onRead: () => void; index: number }) {
  const { icon: Icon, color, bg } = iconMap[notif.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={onRead}
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-secondary/60 transition-colors",
        !notif.isRead && "bg-purple-50/50"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-10 h-10">
          <AvatarImage src={notif.fromUser.avatar} />
          <AvatarFallback className="text-xs">{getInitials(notif.fromUser.displayName)}</AvatarFallback>
        </Avatar>
        <div className={cn("absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white", bg)}>
          <Icon className={cn("w-2.5 h-2.5", color)} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{notif.message}</p>
        <span className="text-xs text-muted-foreground mt-0.5 block">{timeAgo(notif.createdAt)}</span>
      </div>
      {!notif.isRead && (
        <span className="w-2 h-2 rounded-full bg-[hsl(270,75%,60%)] flex-shrink-0 mt-1.5" />
      )}
    </motion.div>
  );
}
