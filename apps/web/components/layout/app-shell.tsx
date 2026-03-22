"use client";

import * as React from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen" style={{ background: "linear-gradient(180deg, #d2ede5 0%, #e2f3ed 40%, #ebf5f3 100%)" }}>
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar via Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <TopBar onMobileMenuOpen={() => setSidebarOpen(true)} />
        <main
          className="relative flex-1 overflow-y-auto p-6 md:p-8 animate-page-fade-in"
          style={{ background: "linear-gradient(180deg, #d2ede5 0%, #e2f3ed 40%, #ebf5f3 100%)" }}
        >
          {/* Decorative floating leaves on page background */}
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            <svg className="absolute top-20 right-8 opacity-20 animate-float" style={{ animationDuration: "6s" }} width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z" fill="hsl(142 60% 45%)" transform="rotate(30 16 16)" />
              <line x1="16" y1="8" x2="16" y2="28" stroke="hsl(142 50% 35%)" strokeWidth="1" opacity="0.5" transform="rotate(30 16 16)" />
            </svg>
            <svg className="absolute top-[45%] left-6 opacity-15 animate-float" style={{ animationDuration: "7s", animationDelay: "2s" }} width="35" height="35" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z" fill="hsl(142 65% 50%)" transform="rotate(-25 16 16)" />
            </svg>
            <svg className="absolute bottom-32 right-20 opacity-15 animate-float" style={{ animationDuration: "5s", animationDelay: "1s" }} width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z" fill="hsl(142 55% 48%)" transform="rotate(55 16 16)" />
            </svg>
            <svg className="absolute top-[70%] right-[40%] opacity-10 animate-float" style={{ animationDuration: "8s", animationDelay: "3s" }} width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 28 10 28 20C28 26 22 30 16 30C10 30 4 26 4 20C4 10 16 2 16 2Z" fill="hsl(142 60% 45%)" transform="rotate(-40 16 16)" />
            </svg>
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
