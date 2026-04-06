"use client";

import { motion } from "motion/react";
import { Coins, TrendingUp, ArrowUpRight, ArrowDownLeft, Gift, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCreditsStore } from "@/store/creditsStore";
import { CREDIT_PACKAGES } from "@/data/credits";
import { formatCredits, timeAgo } from "@/lib/utils";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const { balance, transactions, addCredits } = useCreditsStore();

  const handlePurchase = (credits: number, bonus: number | undefined, label: string) => {
    const total = credits + (bonus ?? 0);
    addCredits(total, `Purchased ${label} Pack`);
    toast({
      title: `${formatCredits(total)} credits added! 🎉`,
      description: "Your wallet has been topped up.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl purple-gradient p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 -ml-6 -mb-6" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80 font-medium">Credit Balance</span>
          </div>
          <div className="text-4xl font-bold tabular-nums mb-4">{formatCredits(balance)}</div>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>500 credits on signup · Use to unlock exclusive content</span>
          </div>
        </div>
      </motion.div>

      {/* Credit packages */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Add Credits</h2>
        <div className="grid grid-cols-2 gap-3">
          {CREDIT_PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "card-base p-4 relative cursor-pointer hover:shadow-card-hover transition-shadow",
                pkg.popular && "border-[hsl(270,75%,60%)] border-2"
              )}
              onClick={() => handlePurchase(pkg.credits, pkg.bonus, pkg.label)}
            >
              {pkg.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="text-[10px] px-2">Most Popular</Badge>
                </div>
              )}
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-[hsl(270,75%,60%)]" />
                <span className="text-xs font-semibold text-[hsl(270,75%,60%)]">{pkg.label}</span>
              </div>
              <div className="text-xl font-bold text-foreground tabular-nums">
                {formatCredits(pkg.credits)}
                {pkg.bonus && (
                  <span className="text-sm text-emerald-600 font-semibold ml-1">+{pkg.bonus}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-3">credits{pkg.bonus ? " + bonus" : ""}</div>
              <Button
                size="sm"
                variant={pkg.popular ? "purple" : "outline"}
                className="w-full text-xs h-8"
                onClick={(e) => { e.stopPropagation(); handlePurchase(pkg.credits, pkg.bonus, pkg.label); }}
              >
                ${pkg.price.toFixed(2)}
              </Button>
              {pkg.bonus && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                  <Gift className="w-3 h-3" /> Bonus included!
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          💡 Demo mode: clicking a package adds credits instantly
        </p>
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Transaction History</h2>
        <div className="card-base divide-y divide-border">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                tx.amount > 0 ? "bg-emerald-50" : "bg-red-50"
              )}>
                {tx.amount > 0
                  ? <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  : <ArrowDownLeft className="w-4 h-4 text-rose-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{tx.description}</div>
                <div className="text-xs text-muted-foreground">{timeAgo(tx.createdAt)}</div>
              </div>
              <div className={cn(
                "text-sm font-semibold tabular-nums flex-shrink-0",
                tx.amount > 0 ? "text-emerald-600" : "text-rose-500"
              )}>
                {tx.amount > 0 ? "+" : ""}{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How credits work */}
      <div className="card-base p-4 bg-purple-50 border-purple-100 space-y-2">
        <h3 className="text-sm font-semibold text-purple-900">How credits work</h3>
        {[
          "Buy credits once — they never expire",
          "Use credits to unlock individual posts from creators",
          "Send tips to creators you love",
          "Subscriptions deduct credits automatically each month",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-purple-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
