"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Recycle } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Branding block */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
          <Recycle className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-emerald-600">ECO</span>
          <span className="text-xs font-medium tracking-wide text-gray-500">
            DASHBOARD
          </span>
        </div>
      </div>

      <Separator />

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 border-l-2",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                    )}
                  />
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <Separator />

      {/* Admin user block */}
      <div className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback className="bg-emerald-100 text-emerald-700">
            AD
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">Admin</span>
      </div>
    </aside>
  );
}
