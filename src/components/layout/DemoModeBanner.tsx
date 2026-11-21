"use client";

import { Sparkles } from "lucide-react";

export function DemoModeBanner() {
  return (
    <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-navy-800 text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
        <span className="font-medium">
          YuridikSim AI Ta'lim Rejimi:
        </span>
        <span className="text-teal-100">
          Ushbu kazus to'liq o'quv simulyatsiyasi bo'lib, barcha ma'lumotlar sun'iy ravishda shakllantirilgan.
        </span>
      </div>
      <span className="hidden md:inline-block px-2 py-0.5 rounded bg-teal-900/60 text-[10px] text-teal-200 border border-teal-500/30">
        MVP v0.1 • O'zbekiston yurisdiksiyasi
      </span>
    </div>
  );
}
