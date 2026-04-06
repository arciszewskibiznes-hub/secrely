"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle, Users, ImageIcon, TrendingUp, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { getCreatorByUsername } from "@/data/users";
import { getPostsByCreator } from "@/data/posts";
import { useUnlockedStore } from "@/store/unlockedStore";
import { useT, interpolate } from "@/hooks/useT";
import { formatNumber, getInitials } from "@/lib/utils";

export default function CreatorProfilePage({ params }: { params: { username: string } }) {
  const creator = getCreatorByUsername(params.username);
  if (!creator) notFound();

  const posts = getPostsByCreator(creator.id);
  const { isSubscribed, subscribe, unsubscribe } = useUnlockedStore();
  const subscribed = isSubscribed(creator.id);
  const lockedCount = posts.filter((p) => p.isLocked).length;
  const t = useT().creatorProfile;

  return (
    <div className="space-y-5">
      <div className="relative h-44 rounded-2xl overflow-hidden bg-secondary -mx-4">
        {creator.coverImage && (
          <Image src={creator.coverImage} alt={creator.displayName} fill className="object-cover" sizes="800px" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="card-base p-5 -mt-12 relative">
        <div className="flex items-end justify-between mb-4">
          <Avatar className="w-16 h-16 ring-4 ring-white shadow-lg">
            <AvatarImage src={creator.avatar} alt={creator.displayName} />
            <AvatarFallback className="text-lg">{getInitials(creator.displayName)}</AvatarFallback>
          </Avatar>
          <Button variant={subscribed ? "outline" : "purple"} onClick={() => subscribed ? unsubscribe(creator.id) : subscribe(creator.id)}>
            {subscribed ? t.following : t.follow}
          </Button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold text-foreground">{creator.displayName}</h1>
            {creator.isVerified && <CheckCircle className="w-5 h-5 text-[hsl(270,75%,60%)]" />}
          </div>
          <div className="text-sm text-muted-foreground">@{creator.username}</div>
          <p className="text-sm text-foreground leading-relaxed">{creator.bio}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {creator.categories.map((cat) => <Badge key={cat} variant="purple">{cat}</Badge>)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
          {[
            { icon: Users, value: formatNumber(creator.subscriberCount), label: t.followers },
            { icon: ImageIcon, value: creator.postCount, label: t.posts },
            { icon: TrendingUp, value: formatNumber(creator.stats.totalLikes), label: t.likes },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="text-lg font-bold text-foreground tabular-nums">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {lockedCount > 0 && !subscribed && (
          <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg purple-gradient flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-800">{interpolate(t.premiumPosts, { count: lockedCount })}</div>
              <div className="text-xs text-purple-600">{t.unlockIndividually}</div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">{posts.length} {t.posts}</h2>
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
