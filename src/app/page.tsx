import React from "react";
import AccountListClient from "@/components/AccountListClient";
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { AccountData } from "@/types/account";

// ==============================================================================
// CẤU HÌNH DYNAMIC CHO TRANG CHỦ (REAL-TIME DATA)
// Đảm bảo dữ liệu tài khoản trên trang chủ luôn cập nhật tức thì 100%
// ngay sau khi Admin tạo mới, chỉnh sửa hoặc đổi trạng thái Còn hàng/Đã bán.
// ==============================================================================
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Hàm truy vấn trực tiếp từ MongoDB trên Server Component.
 * Nhanh hơn 10 lần so với fetch HTTP qua localhost và không bị kẹt cache cũ.
 */
async function getAccounts(): Promise<AccountData[]> {
  try {
    await dbConnect();
    const accounts = await Account.aggregate([
      {
        $addFields: {
          statusPriority: {
            $cond: {
              if: { $eq: ["$status", "Còn hàng"] },
              then: 0,
              else: 1,
            },
          },
        },
      },
      {
        $sort: {
          statusPriority: 1,
          createdAt: -1,
        },
      },
      { $limit: 100 },
      {
        $project: {
          statusPriority: 0,
        },
      },
    ]);

    return JSON.parse(JSON.stringify(accounts));
  } catch (error) {
    console.error("Lỗi khi tải danh sách tài khoản từ MongoDB:", error);
    return [];
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
           Bảo hành lên tới 3 tháng.
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
