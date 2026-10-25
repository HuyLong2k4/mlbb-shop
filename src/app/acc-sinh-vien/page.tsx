import React from "react";
import Link from "next/link";
import { GraduationCap, SlidersHorizontal } from "lucide-react";
import AccountCard, { AccountProps } from "@/components/AccountCard";

const studentAccounts: AccountProps[] = [
  {
    id: "mlbb-sv-01",
    title: "Acc Trắng Thông Tin Rank Sử Thi - 45 Tướng 30 Skin Đẹp",
    code: "SV-1102",
    category: "SINH_VIEN",
    rank: "Sử Thi I",
    skinCount: 32,
    heroCount: 48,
    highlightSkin: "Chou Đặc Nhiệm + Zilong",
    originalPrice: 150000,
    salePrice: 89000,
  },
  {
    id: "mlbb-sv-02",
    title: "Acc Rank Huyền Thoại Giá Rẻ - Tướng Tủ Hayabusa & Ling",
    code: "SV-2245",
    category: "SINH_VIEN",
    rank: "Huyền Thoại III",
    skinCount: 56,
    heroCount: 65,
    highlightSkin: "Ling Vũ Điệu + Hayabusa",
    originalPrice: 250000,
    salePrice: 149000,
    isHot: true,
  },
  {
    id: "mlbb-sv-03",
    title: "Acc Smurf Rank Tinh Anh - Nhiều Tướng Đi Rừng Đủ Bảng Ngọc",
    code: "SV-3390",
    category: "SINH_VIEN",
    rank: "Tinh Anh II",
    skinCount: 22,
    heroCount: 35,
    highlightSkin: "Gusion Nguyệt Ảnh",
    originalPrice: 99000,
    salePrice: 59000,
  },
  {
    id: "mlbb-sv-04",
    title: "Acc Trắng Thông Tin Giao Ngay - Rank Cao Thủ 80 Tướng",
    code: "SV-4481",
    category: "SINH_VIEN",
    rank: "Huyền Thoại I",
    skinCount: 78,
    heroCount: 82,
    highlightSkin: "Miya Huyền Bí + Alucard",
    originalPrice: 350000,
    salePrice: 220000,
  },
];

export default function AccSinhVienPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-navy-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Phân khúc tiết kiệm</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-100">
            Kho Tài Khoản <span className="text-emerald-400">Acc Sinh Viên MLBB</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Dành cho học sinh, sinh viên với mức giá chỉ từ 50k - 200k. Đầy đủ tướng
            leo rank, bảng ngọc hoàn chỉnh, 100% trắng thông tin đổi mật khẩu ngay.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            Lọc theo:
          </span>
          <select className="bg-navy-950 border border-navy-700 text-xs font-semibold text-slate-200 rounded px-3 py-2 outline-none focus:border-emerald-500">
            <option>Tất cả mức giá</option>
            <option>Dưới 100.000đ</option>
            <option>100.000đ - 200.000đ</option>
            <option>200.000đ - 300.000đ</option>
          </select>
          <select className="bg-navy-950 border border-navy-700 text-xs font-semibold text-slate-200 rounded px-3 py-2 outline-none focus:border-emerald-500">
            <option>Tất cả Rank</option>
            <option>Sử Thi</option>
            <option>Huyền Thoại</option>
            <option>Tinh Anh</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Hiển thị <span className="text-emerald-400 font-bold">4</span> tài khoản sinh viên
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {studentAccounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>
    </div>
  );
}
