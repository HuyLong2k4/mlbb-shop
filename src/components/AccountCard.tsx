import React from "react";
import Link from "next/link";

export interface AccountProps {
  id: string;
  title: string;
  code: string;
  category: "VIP" | "SINH_VIEN";
  rank: string;
  collectionTier?: string;
  skinCount: number;
  heroCount: number;
  highlightSkin: string;
  originalPrice: number;
  salePrice: number;
  imageUrl?: string;
  isHot?: boolean;
}

export default function AccountCard({ account }: { account: AccountProps }) {
  const isVip = account.salePrice >= 1000000;

  return (
    <Link
      href={`/acc/${account.id}`}
      className="group relative bg-navy-900 border border-navy-800 hover:border-gold-500/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-gold-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Banner & Badges (Typography sạch sẽ) */}
      <div className="relative aspect-video w-full overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-950/70 z-10" />

        {account.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={account.imageUrl}
            alt={account.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-950 p-6 group-hover:scale-105 transition-transform duration-500">
            <div className="text-center z-10">
              <span className="text-sm font-bold text-slate-200 uppercase tracking-widest block">
                {account.highlightSkin}
              </span>
            </div>
          </div>
        )}

        {/* Acc Code Badge */}
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-navy-950/90 text-gold-400 border border-gold-500/30 backdrop-blur-sm">
            #{account.code}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          {account.isHot && (
            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
              Hot
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
              isVip
                ? "bg-amber-500/15 text-gold-400 border-gold-500/30"
                : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {isVip ? "VIP" : "Sinh Viên"}
          </span>
        </div>

        {/* Rank / Collection Tier Badge on bottom overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300 bg-navy-950/90 px-2.5 py-0.5 rounded border border-navy-750">
            {account.collectionTier || account.rank}
          </span>
        </div>
      </div>

      {/* Content - Typography phân cấp rõ ràng */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-gold-400 transition-colors">
            {account.title}
          </h3>

          {/* Stats Grid - Không icon, dùng font chữ và độ tương phản */}
          <div className="grid grid-cols-2 gap-3 mt-3.5 py-2.5 px-3 rounded-xl bg-navy-950/70 border border-navy-850">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                Tướng
              </span>
              <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                {account.heroCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                Trang phục
              </span>
              <span className="text-sm font-bold text-gold-400 font-mono mt-0.5 block">
                {account.skinCount}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3.5 border-t border-navy-850 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              Giá bán
            </div>
            <div className="text-base font-bold text-gold-400 font-mono tracking-tight mt-0.5">
              {account.salePrice.toLocaleString("vi-VN")} ₫
            </div>
          </div>

          <span
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-gold-400 to-amber-500 group-hover:from-gold-300 group-hover:to-amber-400 text-navy-950 transition-all shadow-sm group-hover:scale-[1.02]"
          >
            Chi tiết
          </span>
        </div>
      </div>
    </Link>
  );
}
