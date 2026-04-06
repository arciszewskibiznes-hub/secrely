"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isExplore = pathname === "/explore";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar on desktop */}
      <div className="md:ml-60">
        <Header />
        <main
          className={cn(
            "max-w-2xl mx-auto px-4",
            // Explore uses full height with its own internal spacing
            isExplore
              ? "py-3 overflow-hidden"
              : "py-6 page-content"
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
