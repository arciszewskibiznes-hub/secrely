"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Eye, Lock, Unlock, Bookmark } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnlockModal } from "@/components/UnlockModal";
import { useUnlockedStore } from "@/store/unlockedStore";
import { formatNumber, timeAgo, getInitials } from "@/lib/utils";
import { interpolate } from "@/hooks/useT";
import { useT } from "@/hooks/useT";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showUnlock, setShowUnlock] = useState(false);
  const { isUnlocked } = useUnlockedStore();
  const t = useT().postCard;

  const unlocked = !post.isLocked || isUnlocked(post.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="card-base overflow-hidden group"
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <Link href={`/creator/${post.creator.username}`}>
            <Avatar className="w-9 h-9 ring-2 ring-transparent hover:ring-purple-200 transition-all">
              <AvatarImage src={post.creator.avatar} alt={post.creator.displayName} />
              <AvatarFallback className="text-xs">{getInitials(post.creator.displayName)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/creator/${post.creator.username}`} className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground hover:text-[hsl(270,75%,60%)] transition-colors truncate">{post.creator.displayName}</span>
              {post.creator.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full purple-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[8px] font-bold">✓</span>
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">@{post.creator.username}</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          {post.isLocked && (
            <Badge variant={unlocked ? "success" : "purple"} className="flex items-center gap-1">
              {unlocked ? (
                <><Unlock className="w-2.5 h-2.5" /> {t.unlocked}</>
              ) : (
                <><Lock className="w-2.5 h-2.5" /> {post.price} cr</>
              )}
            </Badge>
          )}
        </div>

        {post.thumbnail && (
          <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
            <Image src={post.thumbnail} alt={post.teaserText} fill className={cn("object-cover transition-transform duration-500 group-hover:scale-[1.02]", post.isLocked && !unlocked && "locked-blur")} sizes="(max-width: 640px) 100vw, 600px" />
            {post.isLocked && !unlocked && (
              <div className="absolute inset-0 locked-overlay flex flex-col items-center justify-center gap-3 px-6">
                <div className="w-12 h-12 rounded-2xl purple-gradient flex items-center justify-center shadow-lg purple-glow">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{t.premiumContent}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{interpolate(t.unlockFor, { price: post.price })}</p>
                </div>
                <Button variant="purple" size="sm" onClick={(e) => { e.preventDefault(); setShowUnlock(true); }} className="mt-1">
                  {t.unlockNow}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed line-clamp-2">{unlocked ? post.caption : post.teaserText}</p>
          {!compact && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-[hsl(270,75%,60%)] bg-purple-50 rounded-full px-2.5 py-0.5 font-medium">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={cn("flex items-center gap-1.5 text-sm transition-all", liked ? "text-rose-500" : "text-muted-foreground hover:text-foreground")}>
              <Heart className={cn("w-4 h-4 transition-all", liked && "fill-current scale-110")} />
              <span className="tabular-nums">{formatNumber(likeCount)}</span>
            </button>
            <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="tabular-nums">{formatNumber(post.commentCount)}</span>
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="tabular-nums">{formatNumber(post.viewCount)}</span>
            </span>
          </div>
          <button className="text-muted-foreground hover:text-[hsl(270,75%,60%)] transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <UnlockModal open={showUnlock} onClose={() => setShowUnlock(false)} post={post} />
    </>
  );
}
