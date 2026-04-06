"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, TrendingUp, Users } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { SkeletonPost } from "@/components/SkeletonPost";
import { CreatorCard } from "@/components/CreatorCard";
import { getFeedPosts } from "@/data/posts";
import { MOCK_CREATORS } from "@/data/users";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "following", label: "Following", icon: Users },
  { id: "foryou", label: "For You", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
] as const;

type Tab = typeof tabs[number]["id"];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<Tab>("foryou");
  const [loading, setLoading] = useState(true);
  const posts = getFeedPosts();
  const featuredCreators = MOCK_CREATORS.slice(0, 3);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [activeTab]);

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-secondary p-1 rounded-2xl">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Featured creators strip */}
      {activeTab === "foryou" && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Creators to follow</h2>
            <a href="/explore" className="text-xs text-[hsl(270,75%,60%)] font-medium hover:underline">See all</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featuredCreators.map((creator, i) => (
              <CreatorCard key={creator.id} creator={creator} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonPost key={i} />)
        ) : (
          posts.map((post, i) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
