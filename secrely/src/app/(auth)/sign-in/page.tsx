"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";

export default function SignInPage() {
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { signIn, isLoading } = useAuthStore();
  const router = useRouter();
  const t = useT().signInPage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError(t.errorEmpty); return; }
    try {
      await signIn(email, password);
      router.replace("/feed");
    } catch {
      setError(t.errorGeneric);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div className="card-base p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.email}</label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.password}</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="pr-10" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex items-center justify-end">
            <button type="button" className="text-xs text-[hsl(270,75%,60%)] hover:underline font-medium">{t.forgotPassword}</button>
          </div>

          <Button type="submit" variant="purple" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.submitting}
              </span>
            ) : (
              <span className="flex items-center gap-2">{t.submit} <ArrowRight className="w-4 h-4" /></span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.noAccount}{" "}
            <Link href="/sign-up" className="text-[hsl(270,75%,60%)] font-semibold hover:underline">{t.signUpFree}</Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
          <p className="text-xs text-purple-700 text-center">{t.demoHint}</p>
        </div>
      </div>
    </motion.div>
  );
}
