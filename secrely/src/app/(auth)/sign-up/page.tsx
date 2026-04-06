"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { signUp, isLoading } = useAuthStore();
  const router = useRouter();
  const t = useT().signUpPage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError(t.errorEmpty); return; }
    if (password.length < 6) { setError(t.errorPassword); return; }
    try {
      await signUp(email, password, name);
      router.replace("/feed");
    } catch {
      setError(t.errorGeneric);
    }
  };

  const perks = [t.perk1, t.perk2, t.perk3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm"
    >
      <div className="card-base p-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 mb-6 space-y-2">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-purple-700" />
              </div>
              <span className="text-xs text-purple-800 font-medium">{perk}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.name}</label>
            <Input type="text" placeholder="Alex Rivers" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.email}</label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.password}</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="pr-10" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive bg-red-50 rounded-lg px-3 py-2">{error}</p>}

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

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            {t.terms}{" "}
            <span className="text-[hsl(270,75%,60%)]">{t.termsLink}</span>{" "}
            {t.andText}{" "}
            <span className="text-[hsl(270,75%,60%)]">{t.privacyLink}</span>.
          </p>
        </form>

        <div className="mt-5 text-center">
          <p className="text-sm text-muted-foreground">
            {t.hasAccount}{" "}
            <Link href="/sign-in" className="text-[hsl(270,75%,60%)] font-semibold hover:underline">{t.signIn}</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
