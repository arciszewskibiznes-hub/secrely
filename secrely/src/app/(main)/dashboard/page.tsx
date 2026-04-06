"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Users, DollarSign, Eye, Heart, BarChart2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_CREATORS } from "@/data/users";
import { getPostsByCreator } from "@/data/posts";
import { DASHBOARD_CHART_DATA } from "@/data/credits";
import { formatNumber } from "@/lib/utils";
import type { DashboardMetric } from "@/types";

const creator = MOCK_CREATORS[0]; // Luna Chen as the demo dashboard creator
const posts = getPostsByCreator(creator.id);

const METRICS: DashboardMetric[] = [
  { label: "Monthly Earnings", value: `$${formatNumber(creator.stats.monthlyEarnings)}`, change: 12, changeLabel: "vs last month", trend: "up" },
  { label: "Subscribers", value: formatNumber(creator.subscriberCount), change: 8, changeLabel: "this month", trend: "up" },
  { label: "Total Views", value: formatNumber(creator.stats.totalViews), change: 23, changeLabel: "this month", trend: "up" },
  { label: "Conversion Rate", value: `${creator.stats.conversionRate}%`, change: 0.4, changeLabel: "vs last month", trend: "up" },
];

const maxEarnings = Math.max(...DASHBOARD_CHART_DATA.map((d) => d.earnings));

export default function DashboardPage() {
  const [chartType, setChartType] = useState<"earnings" | "subscribers">("earnings");

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Creator Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your performance at a glance</p>
        </div>
        <Button variant="purple" size="sm" asChild>
          <Link href="/dashboard/new-post">
            <PlusCircle className="w-4 h-4" />
            New Post
          </Link>
        </Button>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <StatCard metric={metric} />
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-base p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[hsl(270,75%,60%)]" />
            <span className="text-sm font-semibold text-foreground">6-Month Overview</span>
          </div>
          <div className="flex bg-secondary rounded-lg p-0.5">
            {(["earnings", "subscribers"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                  chartType === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-32">
          {DASHBOARD_CHART_DATA.map((d) => {
            const value = chartType === "earnings" ? d.earnings : d.subscribers;
            const max = chartType === "earnings"
              ? maxEarnings
              : Math.max(...DASHBOARD_CHART_DATA.map((x) => x.subscribers));
            const height = Math.max(8, (value / max) * 100);

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: 112 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-lg purple-gradient opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ maxWidth: 36 }}
                    title={`${d.month}: ${value}`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          {chartType === "earnings" ? "Earnings up 95% over 6 months" : "Subscriber growth up 44% over 6 months"}
        </div>
      </motion.div>

      {/* Top posts */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Your Top Posts</h2>
        <div className="card-base divide-y divide-border">
          {posts.map((post, i) => (
            <div key={post.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-xs font-bold text-muted-foreground w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{post.teaserText}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Eye className="w-3 h-3" />{formatNumber(post.viewCount)}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Heart className="w-3 h-3" />{formatNumber(post.likeCount)}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {post.isLocked ? (
                  <Badge variant="purple" className="text-[10px]">{post.price} cr</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">Free</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: PlusCircle, label: "New Post", href: "/dashboard/new-post", variant: "purple" as const },
            { icon: Users, label: "View Audience", href: "/explore", variant: "outline" as const },
            { icon: DollarSign, label: "Earnings", href: "/wallet", variant: "outline" as const },
            { icon: TrendingUp, label: "Analytics", href: "/dashboard", variant: "outline" as const },
          ].map(({ icon: Icon, label, href, variant }) => (
            <Button key={label} variant={variant} size="sm" className="gap-2 h-10" asChild>
              <Link href={href}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
