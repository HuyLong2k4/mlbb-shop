import React from "react";
import Link from "next/link";
import { Shield, Sparkles, Sword, Tag, Trophy, ArrowRight } from "lucide-react";

export interface AccountProps {
  id: string;
  title: string;
  code: string;
  category: "VIP" | "SINH_VIEN";
  rank: string;
  skinCount: number;
  heroCount: number;
  highlightSkin: string;
  originalPrice: number;
  salePrice: number;
  imageUrl?: string;
  isHot?: boolean;
}

export default function AccountCard({ account }: { account: AccountProps }) {
  const isVip = account.category === "VIP";
  const discountPercent = Math.round(
    ((account.originalPrice - account.salePrice) / account.originalPrice) * 100
  );

  return (
    <div className="group relative bg-navy-900 border border-navy-700/80 hover:border-gold-500/80 rounded-xl overflow-hidden shadow-navy-card hover:shadow-gold-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Banner & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-navy-850">
        {/* Placeholder game banner graphic with eSports styling */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-950/60 z-10" />

        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950 p-6 group-hover:scale-105 transition-transform duration-500">
          <div className="text-center z-10">
            <span className="text-3xl filter drop-shadow-md">⚔️</span>
            <div className="text-xs font-bold text-slate-300 mt-1 uppercase tracking-wider">
              {account.highlightSkin}
            </div>
          </div>
        </div>

        {/* Acc Code Badge */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-navy-950/90 text-gold-400 border border-gold-500/40 backdrop-blur-sm">
            #{account.code}
          </span>
        </div>

        {/* Category Badge (VIP vs Sinh Viên) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
          {account.isHot && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">
              HOT
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border shadow-sm ${
              isVip
                ? "bg-amber-500/20 text-gold-300 border-gold-500/50"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}
          >
            {isVip ? "ACC VIP" : "SINH VIÊN"}
          </span>
        </div>

        {/* Rank Badge on bottom overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5 text-xs font-bold text-gold-300 bg-navy-950/80 px-2 py-1 rounded border border-navy-700">
          <Trophy className="w-3.5 h-3.5 text-gold-400" />
          <span>{account.rank}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-gold-400 transition-colors uppercase">
            {account.title}
          </h3>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 py-2 px-3 rounded-lg bg-navy-850/80 border border-navy-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sword className="w-3.5 h-3.5 text-gold-400" />
              <span>Tướng: <strong className="text-slate-100">{account.heroCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Trang phục: <strong className="text-gold-400">{account.skinCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 line-through">
              {account.originalPrice.toLocaleString("vi-VN")} đ
            </div>
            <div className="text-base font-extrabold text-gold-400">
              {account.salePrice.toLocaleString("vi-VN")} đ
            </div>
          </div>

          <Link
            href={`/acc/${account.id}`}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-gold-500 hover:bg-gold-400 text-navy-950 transition-colors flex items-center gap-1 shadow-gold-sm"
          >
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
