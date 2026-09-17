import React from "react";
import { HeartPulse } from "lucide-react";

export default function LoadingSpinner({ label = "Loading NutriPulse..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 animate-bounce">
        <HeartPulse className="w-8 h-8" />
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">{label}</p>
    </div>
  );
}
