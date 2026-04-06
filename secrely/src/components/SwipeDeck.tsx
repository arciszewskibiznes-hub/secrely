"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bookmark, Unlock, Eye, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { SwipeCard, type SwipeDirection } from "@/components/SwipeCard";
import { UnlockModal } from "@/components/UnlockModal";
import { Button } from "@/components/ui/button";
import { useUnlockedStore } from "@/store/unlockedStore";
import { useCreditsStore } from "@/store/creditsStore";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

interface SwipeDeckProps {
  posts: Post[];
  onQueueEmpty?: () => void;
}

const MAX_VISIBLE = 3; // how many cards to render in the stack

export function SwipeDeck({ posts, onQueueEmpty }: SwipeDeckProps) {
  const [queue, setQueue] = useState<Post[]>(posts);
  const [saved, setSaved] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [history, setHistory] = useState<{ post: Post; dir: SwipeDirection }[]>([]);
  const [unlockTarget, setUnlockTarget] = useState<Post | null>(null);
  const [actionHint, setActionHint] = useState<"skip" | "save" | null>(null);

  const { isUnlocked } = useUnlockedStore();
  const { canAfford } = useCreditsStore();

  const currentPost = queue[0] ?? null;

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      const post = queue[0];
      if (!post) return;

      setHistory((h) => [...h, { post, dir: direction }]);
      setQueue((q) => q.slice(1));

      if (direction === "right") {
        setSaved((s) => [...s, post.id]);
        toast({
          title: "Saved!",
          description: `${post.creator.displayName}'s post added to your saves`,
          variant: "success",
        });
      } else {
        setSkipped((s) => [...s, post.id]);
      }

      if (queue.length <= 1) {
        onQueueEmpty?.();
      }
    },
    [queue, onQueueEmpty]
  );

  const triggerSwipe = (direction: SwipeDirection) => {
    // Visual hint then swipe
    setActionHint(direction === "left" ? "skip" : "save");
    setTimeout(() => {
      setActionHint(null);
      handleSwipe(direction);
    }, 180);
  };

  const handleUndo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    setQueue((q) => [last.post, ...q]);
    if (last.dir === "right") {
      setSaved((s) => s.filter((id) => id !== last.post.id));
    } else {
      setSkipped((s) => s.filter((id) => id !== last.post.id));
    }
    toast({ title: "Undone", description: "Card restored" });
  };

  const handleCardTap = (post: Post) => {
    if (post.isLocked && !isUnlocked(post.id)) {
      setUnlockTarget(post);
    }
    // For free posts, tap just lets user read the caption — no modal needed
  };

  const handleViewPost = () => {
    if (!currentPost) return;
    if (currentPost.isLocked && !isUnlocked(currentPost.id)) {
      setUnlockTarget(currentPost);
    }
    // Free post — navigate directly
  };

  const visibleCards = queue.slice(0, MAX_VISIBLE);

  // Empty state
  if (queue.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full gap-6 text-center px-8"
      >
        <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center">
          <Sparkles className="w-9 h-9 text-[hsl(270,75%,60%)]" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            You&apos;ve seen it all
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You&apos;ve gone through {skipped.length + saved.length} posts.{" "}
            {saved.length > 0 && `${saved.length} saved.`}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            variant="purple"
            onClick={() => {
              setQueue(posts);
              setSaved([]);
              setSkipped([]);
              setHistory([]);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Start over
          </Button>
          <Button variant="outline" asChild>
            <Link href="/feed">Back to Feed</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* ── Card Stack ── */}
      <div className="relative flex-1 w-full">
        <AnimatePresence>
          {[...visibleCards].reverse().map((post, reversedIdx) => {
            const stackIndex = visibleCards.length - 1 - reversedIdx;
            const isTop = stackIndex === 0;

            return (
              <SwipeCard
                key={post.id}
                post={post}
                isTop={isTop}
                stackIndex={stackIndex}
                isUnlocked={isUnlocked(post.id)}
                onSwipe={handleSwipe}
                onTap={() => handleCardTap(post)}
              />
            );
          })}
        </AnimatePresence>

        {/* Swipe direction hint overlays (triggered by buttons) */}
        <AnimatePresence>
          {actionHint === "skip" && (
            <motion.div
              key="hint-skip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-3xl pointer-events-none z-30 border-4 border-rose-400/60"
            />
          )}
          {actionHint === "save" && (
            <motion.div
              key="hint-save"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-3xl pointer-events-none z-30 border-4 border-emerald-400/60"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Counter ── */}
      <div className="flex items-center justify-between px-1 py-1">
        <span className="text-xs text-muted-foreground">
          {queue.length} left · {saved.length} saved
        </span>
        {history.length > 0 && (
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 text-xs text-[hsl(270,75%,60%)] font-medium hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Undo
          </button>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex items-center justify-center gap-4 pb-2">
        {/* Skip */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => triggerSwipe("left")}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-14 h-14 rounded-full bg-white border-2 border-rose-200 shadow-card flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:border-rose-300 transition-colors">
            <X className="w-6 h-6 stroke-[2.5px]" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Skip</span>
        </motion.button>

        {/* Main action — Unlock or View */}
        {currentPost && (
          <motion.div whileTap={{ scale: 0.93 }} className="flex flex-col items-center gap-1.5">
            {currentPost.isLocked && !isUnlocked(currentPost.id) ? (
              <>
                <button
                  onClick={() => setUnlockTarget(currentPost)}
                  className={cn(
                    "w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all",
                    canAfford(currentPost.price)
                      ? "purple-gradient purple-glow hover:opacity-90"
                      : "bg-gray-100 border-2 border-gray-200"
                  )}
                >
                  <Unlock
                    className={cn(
                      "w-6 h-6 stroke-[2.5px]",
                      canAfford(currentPost.price) ? "text-white" : "text-muted-foreground"
                    )}
                  />
                </button>
                <span className="text-[10px] font-semibold text-[hsl(270,75%,60%)] tracking-wide uppercase">
                  Unlock · {currentPost.price}cr
                </span>
              </>
            ) : (
              <>
                <Link
                  href={`/post/${currentPost.id}`}
                  className="w-16 h-16 rounded-full purple-gradient shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Eye className="w-6 h-6 text-white stroke-[2.5px]" />
                </Link>
                <span className="text-[10px] font-semibold text-[hsl(270,75%,60%)] tracking-wide uppercase">
                  View
                </span>
              </>
            )}
          </motion.div>
        )}

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => triggerSwipe("right")}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-200 shadow-card flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
            <Bookmark className="w-6 h-6 stroke-[2.5px]" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Save</span>
        </motion.button>
      </div>

      {/* ── Unlock modal ── */}
      {unlockTarget && (
        <UnlockModal
          open={!!unlockTarget}
          onClose={() => setUnlockTarget(null)}
          post={unlockTarget}
        />
      )}
    </>
  );
}
