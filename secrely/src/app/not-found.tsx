"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-sm"
      >
        {/* Large 404 */}
        <div className="relative mb-8">
          <div className="text-[120px] font-display font-bold leading-none tracking-tight gradient-text select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl purple-gradient/10 bg-purple-50 flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-3">
          This page is locked
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or requires access you don&apos;t have yet.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="purple" asChild>
            <Link href="/feed">
              <Home className="w-4 h-4" />
              Go to Feed
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/explore">
              <Compass className="w-4 h-4" />
              Explore Creators
            </Link>
          </Button>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go back
        </button>
      </motion.div>
    </div>
  );
}
