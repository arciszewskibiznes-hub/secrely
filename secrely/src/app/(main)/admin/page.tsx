"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Shield, CheckCircle, XCircle, Clock, Eye, Flag, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_MODERATION_ITEMS } from "@/data/moderation";
import { getInitials, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ModerationItem } from "@/types";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200" },
};

type Filter = "all" | "pending" | "approved" | "rejected";

export default function AdminPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState<ModerationItem[]>(MOCK_MODERATION_ITEMS);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, reviewedAt: new Date().toISOString() }
          : item
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Moderation Queue</h1>
          <p className="text-sm text-muted-foreground">{counts.pending} pending review</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {(["all", "pending", "approved", "rejected"] as Filter[]).map((f) => {
          const config = f === "all" ? null : STATUS_CONFIG[f];
          const Icon = config?.icon ?? Flag;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "card-base p-3 text-center transition-all",
                filter === f && f !== "all" && `${config?.border} border-2`,
                filter === f && f === "all" && "border-[hsl(270,75%,60%)] border-2"
              )}
            >
              <div className="text-lg font-bold text-foreground tabular-nums">{counts[f]}</div>
              <div className="text-[10px] text-muted-foreground capitalize mt-0.5">{f}</div>
            </button>
          );
        })}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected"] as Filter[]).map((f) => {
          const config = f !== "all" ? STATUS_CONFIG[f] : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                filter === f
                  ? "bg-[hsl(270,75%,60%)] text-white border-[hsl(270,75%,60%)]"
                  : "bg-white border-border text-muted-foreground hover:border-[hsl(270,75%,60%)] hover:text-[hsl(270,75%,60%)]"
              )}
            >
              {config && <config.icon className="w-3 h-3" />}
              <span className="capitalize">{f}</span>
              <span className="bg-white/20 rounded-full px-1">{counts[f]}</span>
            </button>
          );
        })}
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const config = STATUS_CONFIG[item.status];
          const StatusIcon = config.icon;
          const isExpanded = expanded === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-base overflow-hidden"
            >
              {/* Item header */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {item.thumbnail && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                      <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Creator + status */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={item.creator.avatar} />
                          <AvatarFallback className="text-[9px]">{getInitials(item.creator.displayName)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-foreground">{item.creator.displayName}</span>
                        <Badge variant="secondary" className="text-[9px] capitalize">{item.type}</Badge>
                      </div>
                      <div className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border", config.color, config.bg, config.border)}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </div>
                    </div>

                    {/* Content preview */}
                    <p className="text-xs text-foreground leading-relaxed line-clamp-2">{item.content}</p>

                    {/* Times */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>Submitted {timeAgo(item.submittedAt)}</span>
                      {item.reviewedAt && <span>· Reviewed {timeAgo(item.reviewedAt)}</span>}
                    </div>

                    {/* Rejection reason */}
                    {item.status === "rejected" && item.reason && (
                      <div className="mt-2 px-3 py-2 bg-rose-50 rounded-lg border border-rose-200">
                        <p className="text-[10px] text-rose-700">
                          <span className="font-semibold">Rejection reason: </span>{item.reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : item.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                </div>

                {/* Actions for pending */}
                {item.status === "pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => updateStatus(item.id, "rejected")}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs gap-1.5 text-muted-foreground"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => updateStatus(item.id, "approved")}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-border px-4 py-3 bg-secondary/40 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Creator</span>
                      <span className="font-medium text-foreground">{item.creator.displayName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Subscribers</span>
                      <span className="font-medium text-foreground">{item.creator.subscriberCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Content type</span>
                      <span className="font-medium text-foreground capitalize">{item.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Verified</span>
                      <span className={cn("font-medium", item.creator.isVerified ? "text-emerald-600" : "text-muted-foreground")}>
                        {item.creator.isVerified ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Full content description</span>
                    <p className="text-xs text-foreground leading-relaxed">{item.content}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-foreground">All clear!</p>
            <p className="text-xs text-muted-foreground mt-1">No {filter !== "all" ? filter : ""} items to review</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
