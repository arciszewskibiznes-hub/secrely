"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  User, Bell, Lock, CreditCard, Shield, HelpCircle,
  LogOut, ChevronRight, Moon, Globe, Eye, Smartphone,
  Mail, MessageCircle, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SettingToggle {
  id: string;
  label: string;
  description?: string;
  defaultValue: boolean;
}

interface SettingLink {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  badge?: string;
  danger?: boolean;
}

const notificationToggles: SettingToggle[] = [
  { id: "new_post", label: "New posts from creators you follow", defaultValue: true },
  { id: "likes", label: "Likes on your posts", defaultValue: true },
  { id: "comments", label: "Comments and replies", defaultValue: true },
  { id: "follows", label: "New followers", defaultValue: true },
  { id: "messages", label: "Direct messages", defaultValue: true },
  { id: "promotions", label: "Promotions and offers", defaultValue: false },
];

const privacyToggles: SettingToggle[] = [
  { id: "private", label: "Private profile", description: "Only approved followers can see your content", defaultValue: false },
  { id: "show_activity", label: "Show activity status", description: "Let others see when you're online", defaultValue: true },
  { id: "read_receipts", label: "Read receipts", description: "Show when you've read messages", defaultValue: true },
  { id: "data_analytics", label: "Analytics & performance data", description: "Help improve creator insights", defaultValue: true },
];

export default function SettingsPage() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    [...notificationToggles, ...privacyToggles].forEach((t) => {
      initial[t.id] = t.defaultValue;
    });
    return initial;
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  const toggle = (id: string) => setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  const accountLinks: SettingLink[] = [
    { id: "profile", label: "Edit Profile", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "phone", label: "Phone Number", icon: Smartphone, badge: "Add" },
    { id: "email", label: "Email Preferences", icon: Mail },
  ];

  const supportLinks: SettingLink[] = [
    { id: "help", label: "Help Center", icon: HelpCircle },
    { id: "report", label: "Report a Problem", icon: Shield },
    { id: "feedback", label: "Send Feedback", icon: MessageCircle },
    { id: "about", label: "About Secrely", icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Profile summary */}
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
      <Section title="Appearance">
        <SettingRow
          icon={Moon}
          label="Dark Mode"
          description="Switch to dark theme"
          right={<Switch checked={darkMode} onCheckedChange={setDarkMode} />}
        />
        <SettingRow
          icon={Globe}
          label="Language"
          description="English (US)"
          right={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
          onClick={() => {}}
        />
        <SettingRow
          icon={Eye}
          label="Content Preferences"
          description="Manage what you see in your feed"
          right={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
          onClick={() => {}}
        />
      </Section>

      {/* Account */}
      <Section title="Account">
        {accountLinks.map(({ id, label, icon: Icon, badge }) => (
          <SettingRow
            key={id}
            icon={Icon}
            label={label}
            right={
              badge ? (
                <span className="text-xs text-[hsl(270,75%,60%)] font-semibold">{badge}</span>
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )
            }
            onClick={() => {}}
          />
        ))}
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {notificationToggles.map((t) => (
          <SettingRow
            key={t.id}
            label={t.label}
            description={t.description}
            right={<Switch checked={toggles[t.id]} onCheckedChange={() => toggle(t.id)} />}
          />
        ))}
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Security">
        {privacyToggles.map((t) => (
          <SettingRow
            key={t.id}
            label={t.label}
            description={t.description}
            right={<Switch checked={toggles[t.id]} onCheckedChange={() => toggle(t.id)} />}
          />
        ))}
      </Section>

      {/* Support */}
      <Section title="Help & Support">
        {supportLinks.map(({ id, label, icon: Icon }) => (
          <SettingRow
            key={id}
            icon={Icon}
            label={label}
            right={<ChevronRight className="w-4 h-4 text-muted-foreground" />}
            onClick={() => {}}
          />
        ))}
      </Section>

      {/* Sign out */}
      <div className="card-base overflow-hidden">
        {!showSignOutConfirm ? (
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors text-rose-500"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        ) : (
          <div className="p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Are you sure you want to sign out?</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowSignOutConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" size="sm" className="flex-1" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground pb-4">
        Secrely v1.0.0 — MVP Build · All data is local
      </p>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        {title}
      </h3>
      <div className="card-base divide-y divide-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface SettingRowProps {
  icon?: React.ElementType;
  label: string;
  description?: string;
  right: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingRow({ icon: Icon, label, description, right, onClick, danger }: SettingRowProps) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      {...(onClick ? { onClick } : {})}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 text-left",
        onClick && "hover:bg-secondary/60 transition-colors cursor-pointer",
        danger && "text-rose-500"
      )}
    >
      {Icon && (
        <Icon className={cn("w-4 h-4 flex-shrink-0", danger ? "text-rose-500" : "text-muted-foreground")} />
      )}
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium", danger ? "text-rose-500" : "text-foreground")}>{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{right}</div>
    </Wrapper>
  );
}
