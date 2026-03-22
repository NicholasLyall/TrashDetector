"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Recycle, MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function JungleIllustration() {
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
      viewBox="0 0 256 200"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      aria-hidden="true"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="jungleBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(160 40% 85%)" stopOpacity="0" />
          <stop offset="40%" stopColor="hsl(160 45% 75%)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(142 50% 40%)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect width="256" height="200" fill="url(#jungleBg)" />

      {/* Large tropical leaf - left */}
      <g opacity="0.7">
        <path d="M-10 200 Q20 140 50 120 Q30 150 35 200Z" fill="hsl(142 55% 35%)" />
        <path d="M0 200 Q35 130 65 110 Q40 145 45 200Z" fill="hsl(142 50% 42%)" />
        <path d="M10 200 Q45 145 70 130 Q50 155 52 200Z" fill="hsl(142 45% 48%)" />
      </g>

      {/* Fan palm - center-left */}
      <g opacity="0.6">
        <path d="M80 200 Q85 160 100 140 Q90 165 92 200Z" fill="hsl(142 50% 38%)" />
        <path d="M85 200 Q100 150 120 130 Q100 160 98 200Z" fill="hsl(142 55% 45%)" />
        <path d="M95 200 Q115 155 135 140 Q112 160 108 200Z" fill="hsl(142 48% 40%)" />
      </g>

      {/* Right tropical cluster */}
      <g opacity="0.65">
        <path d="M180 200 Q185 155 200 135 Q190 160 192 200Z" fill="hsl(142 50% 36%)" />
        <path d="M190 200 Q210 145 235 125 Q215 155 210 200Z" fill="hsl(142 52% 42%)" />
        <path d="M200 200 Q225 150 256 130 Q235 158 230 200Z" fill="hsl(142 48% 38%)" />
      </g>

      {/* Small ferns/grass */}
      <g opacity="0.5">
        <ellipse cx="60" cy="195" rx="15" ry="8" fill="hsl(142 60% 45%)" />
        <ellipse cx="150" cy="192" rx="18" ry="10" fill="hsl(142 55% 40%)" />
        <ellipse cx="220" cy="196" rx="12" ry="7" fill="hsl(142 58% 43%)" />
      </g>

      {/* Monstera-style leaf */}
      <g opacity="0.55">
        <circle cx="140" cy="165" r="18" fill="hsl(142 50% 40%)" />
        <circle cx="135" cy="162" r="4" fill="hsl(160 45% 75%)" opacity="0.3" />
        <circle cx="145" cy="170" r="3" fill="hsl(160 45% 75%)" opacity="0.3" />
      </g>
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative flex h-screen w-[280px] flex-col bg-[#d2ede5] overflow-hidden rounded-tr-[2.5rem] rounded-br-[2.5rem] shadow-[4px_0_24px_-12px_rgba(0,100,50,0.1)]">
      {/* Branding block */}
      <div className="flex items-center gap-3 p-8 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm shrink-0">
          <Recycle className="h-7 w-7 text-emerald-500" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xl font-extrabold leading-none tracking-tight text-emerald-950">ECO</span>
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-600 uppercase mt-1">
            Dashboard
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-1 flex-col gap-1.5 px-4 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-white text-emerald-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)] font-bold"
                  : "text-emerald-900/70 hover:bg-white/40 font-semibold"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-emerald-500" : ""
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Jungle illustration */}
      <JungleIllustration />

      {/* Admin user block */}
      <div className="relative z-10 flex items-center justify-between p-3 bg-white/60 backdrop-blur-md rounded-[1.5rem] border border-white/40 mx-5 mb-5 cursor-pointer hover:bg-white/80 transition-colors">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-amber-400 text-white shadow-inner">
              A
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 overflow-hidden">
            <span className="text-sm font-bold text-slate-800 block truncate">Admin</span>
            <span className="text-[11px] font-medium text-emerald-700/70 truncate block">alex@ecodash.io</span>
          </div>
        </div>
        <MoreVertical className="h-[18px] w-[18px] text-slate-400 mr-1 shrink-0" />
      </div>
    </aside>
  );
}
