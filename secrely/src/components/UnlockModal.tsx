"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Coins, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreditsStore } from "@/store/creditsStore";
import { useUnlockedStore } from "@/store/unlockedStore";
import { toast } from "@/hooks/useToast";
import { formatCredits, getInitials } from "@/lib/utils";
import type { Post } from "@/types";

interface UnlockModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

export function UnlockModal({ open, onClose, post }: UnlockModalProps) {
  const [step, setStep] = useState<"confirm" | "success" | "insufficient">("confirm");
  const [isLoading, setIsLoading] = useState(false);
  const { balance, spendCredits } = useCreditsStore();
  const { unlockPost } = useUnlockedStore();
  const canAfford = balance >= post.price;

  const handleUnlock = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    // Future: POST /api/posts/:id/unlock
    const success = spendCredits(
      post.price,
      `Unlocked: ${post.teaserText.slice(0, 60)} by ${post.creator.displayName}`,
      post.id
    );
    setIsLoading(false);
    if (success) {
      unlockPost(post.id);
      setStep("success");
      toast({
        title: "Content Unlocked! 🎉",
        description: `You unlocked exclusive content from ${post.creator.displayName}`,
        variant: "success",
      });
    } else {
      setStep("insufficient");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep("confirm"), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Unlock Premium Content</DialogTitle>
              <DialogDescription className="text-center">
                Get exclusive access to this post from {post.creator.displayName}
              </DialogDescription>
            </DialogHeader>

            {/* Creator info */}
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.creator.avatar} />
                <AvatarFallback>{getInitials(post.creator.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{post.creator.displayName}</div>
                <div className="text-xs text-muted-foreground">@{post.creator.username}</div>
              </div>
            </div>

            {/* Post preview */}
            {post.thumbnail && (
              <div className="relative h-32 rounded-xl overflow-hidden">
                <Image src={post.thumbnail} alt="" fill className="object-cover locked-blur" sizes="400px" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center shadow-lg">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {post.teaserText}
            </p>

            {/* Price / balance */}
            <div className="bg-purple-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Unlock price</span>
                <span className="font-semibold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-[hsl(270,75%,60%)]" />
                  {post.price} credits
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your balance</span>
                <span className={`font-semibold ${canAfford ? "text-emerald-600" : "text-rose-500"}`}>
                  {formatCredits(balance)} credits
                </span>
              </div>
              {canAfford && (
                <div className="flex items-center justify-between text-sm pt-1 border-t border-purple-200">
                  <span className="text-muted-foreground">After unlock</span>
                  <span className="font-semibold text-foreground">
                    {formatCredits(balance - post.price)} credits
                  </span>
                </div>
              )}
            </div>

            {!canAfford && (
              <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Not enough credits. Top up your wallet to continue.</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              {canAfford ? (
                <Button
                  variant="purple"
                  className="flex-1"
                  onClick={handleUnlock}
                  disabled={isLoading}
                >
                  {isLoading ? "Unlocking…" : `Unlock for ${post.price} cr`}
                </Button>
              ) : (
                <Button variant="default" className="flex-1" onClick={handleClose} asChild>
                  <a href="/wallet">Get Credits</a>
                </Button>
              )}
            </div>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Content Unlocked!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enjoy your exclusive content from {post.creator.displayName}
              </p>
            </div>
            <Button variant="purple" className="w-full" onClick={handleClose}>
              View Content
            </Button>
          </div>
        )}

        {step === "insufficient" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Not Enough Credits</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add more credits to your wallet to unlock this content.
              </p>
            </div>
            <Button variant="purple" className="w-full" onClick={handleClose} asChild>
              <a href="/wallet">Top Up Wallet</a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
