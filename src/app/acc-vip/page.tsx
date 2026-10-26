"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, RefreshCw, AlertCircle } from "lucide-react";
import AccountCard, { AccountProps } from "@/components/AccountCard";

export default function AccVipPage() {
  const [accounts, setAccounts] = useState<AccountProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVipAccounts = async () => {
      try {
        const res = await fetch("/api/accounts?status=Còn hàng&limit=50", {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Lọc các nick VIP: Giá từ 1.000.000 ₫ trở lên
          const vipList: AccountProps[] = data.data
            .filter((acc: any) => {
              const price = acc.price || 0;
              return price >= 1000000;
            })
            .map((acc: any) => ({
              id: acc.id,
              title: acc.title,
              code: acc.id,
              category: "VIP" as const,
              collectionTier: acc.collectionTier || "Sưu tập truyền kỳ",
              skinCount: acc.skinCount || 0,
              heroCount: acc.heroCount || 0,
              highlightSkin:
                acc.highlightSkins?.[0] || acc.highlightSkins?.join(", ") || acc.collectionTier || "VIP",
              originalPrice: acc.originalPrice || acc.price || 0,
              salePrice: acc.price || 0,
              imageUrl: acc.images?.[0] || acc.screenshots?.[0]?.imageUrl || "",
              isHot: true,
            }));

          setAccounts(vipList);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách Acc VIP:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVipAccounts();
  }, []);

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
            Tổng hợp các tài khoản VIP trở lên sở hữu các dòng Skin hiếm Legend, Hợp tác, Collector, Prime.
          </p>
        </div>
      </div>

      {/* Toolbar đối soát số lượng */}
      <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
        <div className="text-xs text-slate-300">
          Hiện có <strong className="text-gold-400 font-mono font-bold text-sm">{accounts.length}</strong> tài khoản VIP sẵn sàng giao dịch
        </div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-gold-400 transition-colors font-medium"
        >
          Xem tất cả tại Trang chủ →
        </Link>
      </div>

      {/* Trạng thái Loading */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-gold-400 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Đang tải kho Acc VIP...
          </p>
        </div>
      )}

      {/* Danh sách thẻ Card */}
      {!loading && accounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      )}

      {/* Trạng thái Empty */}
      {!loading && accounts.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-navy-900/40 rounded-2xl border border-navy-800">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
          <p className="text-sm font-bold text-slate-300 uppercase">
            Hiện tại chưa có tài khoản VIP nào trong kho
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-gold-400 text-navy-950"
          >
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  );
}
