"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Users, ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnlockedStore } from "@/store/unlockedStore";
import { useT } from "@/hooks/useT";
import { formatNumber, getInitials } from "@/lib/utils";
import type { Creator } from "@/types";

interface CreatorCardProps {
  creator: Creator;
  index?: number;
}

export function CreatorCard({ creator, index = 0 }: CreatorCardProps) {
  const { isSubscribed, subscribe, unsubscribe } = useUnlockedStore();
  const subscribed = isSubscribed(creator.id);
  const t = useT().creatorCard;

  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (subscribed) unsubscribe(creator.id);
    else subscribe(creator.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/creator/${creator.username}`} className="block group">
        <div className="card-base overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
          <div className="relative h-28 bg-secondary overflow-hidden">
            {creator.coverImage && (
              <Image src={creator.coverImage} alt={creator.displayName} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 300px" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {creator.isVerified && (
              <div className="absolute top-2.5 right-2.5">
                <span className="w-5 h-5 rounded-full purple-gradient flex items-center justify-center shadow">
                  <span className="text-white text-[9px] font-bold">✓</span>
                </span>
              </div>
            )}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-end justify-between -mt-6 mb-3">
              <Avatar className="w-12 h-12 ring-3 ring-white shadow-md">
                <AvatarImage src={creator.avatar} alt={creator.displayName} />
                <AvatarFallback className="text-sm">{getInitials(creator.displayName)}</AvatarFallback>
              </Avatar>
              <Button size="sm" variant={subscribed ? "outline" : "purple"} onClick={handleSubscribe} className="h-8 text-xs">
                {subscribed ? t.following : t.follow}
              </Button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-foreground truncate">{creator.displayName}</span>
                {creator.isVerified && <CheckCircle className="w-3.5 h-3.5 text-[hsl(270,75%,60%)] flex-shrink-0" />}
              </div>
              <div className="text-xs text-muted-foreground">@{creator.username}</div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{creator.bio}</p>
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{formatNumber(creator.subscriberCount)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">{creator.postCount}</span>
                <span>{t.posts}</span>
              </div>
              <div className="ml-auto">
                {creator.categories.slice(0, 1).map((cat) => (
                  <Badge key={cat} variant="purple" className="text-[10px]">{cat}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
