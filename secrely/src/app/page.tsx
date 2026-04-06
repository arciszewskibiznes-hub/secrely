"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Lock, Coins, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const features = [
  { icon: Lock, title: "Exclusive Content", desc: "Access premium posts from top creators using Secrely credits." },
  { icon: Coins, title: "Credit System", desc: "Buy credits once, unlock content you actually want — no monthly fees." },
  { icon: Star, title: "Top Creators", desc: "Discover verified creators across photography, art, fitness, music and more." },
];

const socialProof = [
  { value: "50K+", label: "Creators" },
  { value: "2M+", label: "Members" },
  { value: "$12M+", label: "Paid Out" },
];

export default function WelcomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/feed");
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl purple-gradient flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">Secrely</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Button variant="purple" size="sm" asChild>
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 rounded-full px-4 py-1.5 text-xs font-semibold mb-8 border border-purple-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Premium creator platform — now in beta
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
            Exclusive content
            <br />
            <span className="gradient-text">worth unlocking</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto">
            Secrely connects you with elite creators sharing their best work — photography, art, fitness, music, and more. Unlock what you love, skip what you don&apos;t.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="purple" size="xl" asChild>
              <Link href="/sign-up">
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-12 border-t border-border">
            {socialProof.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl w-full mx-auto"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-base p-5 text-left">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-[hsl(270,75%,60%)]" style={{ width: 18, height: 18 }} />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-2 mt-10 text-xs text-muted-foreground"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          No subscription required
          <span className="mx-2 text-border">·</span>
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          Cancel anytime
          <span className="mx-2 text-border">·</span>
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          Secure & private
        </motion.div>
      </main>
    </div>
  );
}
