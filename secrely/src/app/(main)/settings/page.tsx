"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { User, Bell, Lock, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Moon, Globe, Eye, Smartphone, Mail, MessageCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LangToggle } from "@/components/LangToggle";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const t = useT().settings;
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    new_post: true, likes: true, comments: true, follows: true, messages: true, promotions: false,
    private: false, show_activity: true, read_receipts: true, data_analytics: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const toggle = (id: string) => setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSignOut = () => { signOut(); router.replace("/"); };

  const notifItems = [
    { id: "new_post", label: t.notif1 },
    { id: "likes", label: t.notif2 },
    { id: "comments", label: t.notif3 },
    { id: "follows", label: t.notif4 },
    { id: "messages", label: t.notif5 },
    { id: "promotions", label: t.notif6 },
  ];

  const privacyItems = [
    { id: "private", label: t.priv1, desc: t.priv1Desc },
    { id: "show_activity", label: t.priv2, desc: t.priv2Desc },
    { id: "read_receipts", label: t.priv3, desc: t.priv3Desc },
    { id: "data_analytics", label: t.priv4, desc: t.priv4Desc },
  ];

  const accountItems = [
    { id: "profile", label: t.editProfile, icon: User },
    { id: "password", label: t.changePassword, icon: Lock },
    { id: "payment", label: t.payment, icon: CreditCard },
    { id: "phone", label: t.phone, icon: Smartphone, badge: t.phoneAdd },
    { id: "email", label: t.emailPrefs, icon: Mail },
  ];

  const supportItems = [
    { id: "help", label: t.helpCenter, icon: HelpCircle },
    { id: "report", label: t.reportProblem, icon: Shield },
    { id: "feedback", label: t.feedback, icon: MessageCircle },
    { id: "about", label: t.about, icon: Zap },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      {user && (
        <div className="card-base p-4 flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={user.avatar} alt={user.displayName} />
            <AvatarFallback className="text-base">{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground">{user.displayName}</div>
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      )}

      {/* Appearance */}
      <Section title={t.appearance}>
        <SettingRow icon={Moon} label={t.darkMode} description={t.darkModeDesc}
          right={<Switch checked={darkMode} onCheckedChange={setDarkMode} />} />
        {/* Language toggle in settings */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">{t.language}</div>
          </div>
          <LangToggle />
        </div>
        <SettingRow icon={Eye} label={t.contentPrefs} description={t.contentPrefsDesc}
          right={<ChevronRight className="w-4 h-4 text-muted-foreground" />} onClick={() => {}} />
      </Section>

      <Section title={t.account}>
        {accountItems.map(({ id, label, icon: Icon, badge }) => (
          <SettingRow key={id} icon={Icon} label={label}
            right={badge ? <span className="text-xs text-[hsl(270,75%,60%)] font-semibold">{badge}</span> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            onClick={() => {}} />
        ))}
      </Section>

      <Section title={t.notificationsSection}>
        {notifItems.map(({ id, label }) => (
          <SettingRow key={id} label={label} right={<Switch checked={toggles[id]} onCheckedChange={() => toggle(id)} />} />
        ))}
      </Section>

      <Section title={t.privacy}>
        {privacyItems.map(({ id, label, desc }) => (
          <SettingRow key={id} label={label} description={desc} right={<Switch checked={toggles[id]} onCheckedChange={() => toggle(id)} />} />
        ))}
      </Section>

      <Section title={t.support}>
        {supportItems.map(({ id, label, icon: Icon }) => (
          <SettingRow key={id} icon={Icon} label={label} right={<ChevronRight className="w-4 h-4 text-muted-foreground" />} onClick={() => {}} />
        ))}
      </Section>

      <div className="card-base overflow-hidden">
        {!showSignOutConfirm ? (
          <button onClick={() => setShowSignOutConfirm(true)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors text-rose-500">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{t.signOut}</span>
          </button>
        ) : (
          <div className="p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">{t.signOutConfirm}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowSignOutConfirm(false)}>{t.cancel}</Button>
              <Button variant="destructive" size="sm" className="flex-1" onClick={handleSignOut}>{t.signOut}</Button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-4">{t.version}</p>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">{title}</h3>
      <div className="card-base divide-y divide-border overflow-hidden">{children}</div>
    </div>
  );
}

function SettingRow({ icon: Icon, label, description, right, onClick, danger }: {
  icon?: React.ElementType; label: string; description?: string;
  right: React.ReactNode; onClick?: () => void; danger?: boolean;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper {...(onClick ? { onClick } : {})}
      className={cn("w-full flex items-center gap-3 px-4 py-3.5 text-left", onClick && "hover:bg-secondary/60 transition-colors cursor-pointer", danger && "text-rose-500")}>
      {Icon && <Icon className={cn("w-4 h-4 flex-shrink-0", danger ? "text-rose-500" : "text-muted-foreground")} />}
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium", danger ? "text-rose-500" : "text-foreground")}>{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{right}</div>
    </Wrapper>
  );
}
