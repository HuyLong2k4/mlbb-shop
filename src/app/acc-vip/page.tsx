import React from "react";
import Link from "next/link";
import { Flame, Filter, SlidersHorizontal } from "lucide-react";
import AccountCard, { AccountProps } from "@/components/AccountCard";

const vipAccounts: AccountProps[] = [
  {
    id: "mlbb-vip-01",
    title: "Acc MLBB Rank Thần Thoại Vinh Quang - Full Skin Collector",
    code: "VIP-9981",
    category: "VIP",
    rank: "Vinh Quang 120★",
    skinCount: 388,
    heroCount: 125,
    highlightSkin: "Gusion Thấu Kính + Chou Iori",
    originalPrice: 4500000,
    salePrice: 3200000,
    isHot: true,
  },
  {
    id: "mlbb-vip-02",
    title: "Nick Full Tướng - All Skin Prime + Legend Granger & Lesley",
    code: "VIP-7723",
    category: "VIP",
    rank: "Thần Thoại Bất Tử 80★",
    skinCount: 420,
    heroCount: 125,
    highlightSkin: "Granger Ma Nữ + Lesley Thiên Hà",
    originalPrice: 5800000,
    salePrice: 4600000,
    isHot: true,
  },
  {
    id: "mlbb-vip-03",
    title: "Acc Fanny Skylark + Hayabusa Shadow of Obscurity - Winrate 75%",
    code: "VIP-5541",
    category: "VIP",
    rank: "Thần Thoại 45★",
    skinCount: 265,
    heroCount: 118,
    highlightSkin: "Fanny Skylark + Hayabusa Shura",
    originalPrice: 2800000,
    salePrice: 1950000,
  },
  {
    id: "mlbb-vip-04",
    title: "Acc KOF Series Trọn Bộ - Lancelot Floral + Alucard Legend",
    code: "VIP-4319",
    category: "VIP",
    rank: "Thần Thoại 50★",
    skinCount: 310,
    heroCount: 122,
    highlightSkin: "Full 6 Skin KOF + Legend",
    originalPrice: 3900000,
    salePrice: 2850000,
  },
];

export default function AccVipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-navy-900 border border-gold-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Phân khúc cao cấp</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-100">
            Kho Tài Khoản <span className="text-gold-gradient">Acc VIP MLBB</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Tổng hợp các tài khoản Rank Thần Thoại Vinh Quang, Thần Thoại Bất Tử,
            sở hữu các dòng Skin hiếm Collector, Legend, KOF, Aspirants, Prime.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-gold-400" />
            Lọc theo:
          </span>
          <select className="bg-navy-950 border border-navy-700 text-xs font-semibold text-slate-200 rounded px-3 py-2 outline-none focus:border-gold-500">
            <option>Tất cả mức giá</option>
            <option>1.000.000đ - 3.000.000đ</option>
            <option>3.000.000đ - 5.000.000đ</option>
            <option>Trên 5.000.000đ</option>
          </select>
          <select className="bg-navy-950 border border-navy-700 text-xs font-semibold text-slate-200 rounded px-3 py-2 outline-none focus:border-gold-500">
            <option>Tất cả Rank</option>
            <option>Thần Thoại Bất Tử (100★+)</option>
            <option>Thần Thoại Vinh Quang (50★+)</option>
            <option>Thần Thoại</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Hiển thị <span className="text-gold-400 font-bold">4</span> tài khoản VIP
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {vipAccounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>
    </div>
  );
}
