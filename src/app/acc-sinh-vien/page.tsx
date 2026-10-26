"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, RefreshCw, AlertCircle } from "lucide-react";
import AccountCard, { AccountProps } from "@/components/AccountCard";

export default function AccSinhVienPage() {
  const [accounts, setAccounts] = useState<AccountProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentAccounts = async () => {
      try {
        const res = await fetch("/api/accounts?status=Còn hàng&limit=50", {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Lọc các nick giá sinh viên: Giá dưới 1.000.000 ₫
          const studentList: AccountProps[] = data.data
            .filter((acc: any) => {
              const price = acc.price || 0;
              return price < 1000000;
            })
            .map((acc: any) => ({
              id: acc.id,
              title: acc.title,
              code: acc.id,
              category: "SINH_VIEN" as const,
              collectionTier: acc.collectionTier || "Sưu tập truyền kỳ",
              skinCount: acc.skinCount || 0,
              heroCount: acc.heroCount || 0,
              highlightSkin:
                acc.highlightSkins?.[0] || acc.highlightSkins?.join(", ") || acc.collectionTier || "Sinh Viên",
              originalPrice: acc.originalPrice || acc.price || 0,
              salePrice: acc.price || 0,
              imageUrl: acc.images?.[0] || acc.screenshots?.[0]?.imageUrl || "",
              isHot: false,
            }));

          setAccounts(studentList);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách Acc Sinh Viên:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAccounts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-navy-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Phân khúc sinh viên & giá rẻ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-100">
            Kho Tài Khoản <span className="text-emerald-400">Sinh Viên Giá Rẻ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Tuyển chọn tài khoản ngon giá sinh viên cho anh em sẵn sàng quẩy rank ngay.
          </p>
        </div>
      </div>

      {/* Toolbar đối soát số lượng */}
      <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
        <div className="text-xs text-slate-300">
          Hiện có <strong className="text-emerald-400 font-mono font-bold text-sm">{accounts.length}</strong> tài khoản sinh viên sẵn sàng giao dịch
        </div>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
        >
          Xem tất cả tại Trang chủ →
        </Link>
      </div>

      {/* Trạng thái Loading */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Đang tải kho Acc Sinh Viên...
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
            Hiện tại chưa có tài khoản Sinh viên nào trong kho
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-emerald-500 text-navy-950"
          >
            Quay lại trang chủ
          </Link>
        </div>
      )}
    </div>
  );
}
