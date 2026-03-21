"use client";

import { Menu, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar({
  onMobileMenuOpen,
}: {
  onMobileMenuOpen: () => void;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation menu</span>
      </Button>

      {/* Title section */}
      <div className="flex items-center gap-1">
        <h1 className="text-base font-semibold text-gray-800">
          Smart Dashboard
        </h1>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      {/* KPI chip strip placeholder */}
      <div
        id="kpi-strip"
        className="hidden flex-1 items-center justify-center gap-2 md:flex"
      />

      {/* User avatar */}
      <Avatar size="sm">
        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
          AD
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
