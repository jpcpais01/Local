"use client";

import { useApp } from "@/context/AppContext";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { Onboarding } from "./Onboarding";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, activeLocation } = useApp();

  if (!ready) {
    return <div className="min-h-screen" />;
  }

  if (!activeLocation) {
    return <Onboarding />;
  }

  return (
    <div className="flex">
      <SideNav />
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-24 md:pb-10">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
