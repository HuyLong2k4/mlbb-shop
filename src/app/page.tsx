import React from "react";
import AccountListClient from "@/components/AccountListClient";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { MLBBMockAccount } from "@/data/mockAccounts";

// ==============================================================================
// CẤU HÌNH INCREMENTAL STATIC REGENERATION (ISR) CHO TRANG CHỦ
// Revalidate dữ liệu sau mỗi 60 giây (1 phút)
// ==============================================================================
export const revalidate = 60;

/**
 * Hàm fetch dữ liệu danh sách tài khoản chạy trên Server Component.
 * Áp dụng Next.js Data Cache với { next: { revalidate: 60 } } để lưu cache
 * dữ liệu trên server trong 60 giây, giảm thiểu tối đa truy vấn tới Database.
 */
async function getAccounts(): Promise<MLBBMockAccount[]> {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/accounts?status=Còn%20hàng&limit=100`, {
      next: { revalidate: 60, tags: ["accounts"] },
    });

    if (!res.ok) {
      throw new Error(`Fetch API failed with status ${res.status}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    // Dự phòng khi build offline hoặc lúc server nội bộ chưa khởi động
    console.warn("Fetch API từ server chưa sẵn sàng, truy vấn trực tiếp từ MongoDB:", error);
    try {
      await dbConnect();
      const accounts = await Account.find({ status: "Còn hàng" })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
      return JSON.parse(JSON.stringify(accounts));
    } catch (dbErr) {
      console.error("Không thể kết nối MongoDB:", dbErr);
      return [];
    }
  }
}

export default async function HomePage() {
  // 1. Fetch dữ liệu trên Server Component (có cache ISR 60 giây)
  const accounts = await getAccounts();

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Banner eSports */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 border-b border-navy-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-navy-850 border border-gold-500/30 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
              Sàn Giao Dịch Acc MLBB Uy Tín #1 Việt Nam
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-100">
            Kho Tài Khoản <span className="text-gold-gradient">Mobile Legends</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 font-medium">
            100% tài khoản trắng thông tin bảo hành lên tới 3 tháng.
          </p>
        </div>
      </section>

      {/* Danh sách tài khoản kèm bộ lọc tương tác */}
      <div id="accounts-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 scroll-mt-24">
        <AccountListClient initialAccounts={accounts} />
      </div>
    </div>
  );
}
