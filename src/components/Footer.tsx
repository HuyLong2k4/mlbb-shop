import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-850 relative">
      {/* 1. Value Proposition Ribbon - Tối giản hoàn toàn Typography, tăng khoảng trắng */}
      <div className="border-b border-navy-850/80 bg-navy-900/40 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
                100% Uy Tín
              </h4>
              <p className="text-xs text-slate-400 font-medium">Bảo hành trọn đời mọi tài khoản</p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
                Tự Động 24/7
              </h4>
              <p className="text-xs text-slate-400 font-medium">Nhận thông tin nick sau 30 giây</p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
                Đổi Trả An Tâm
              </h4>
              <p className="text-xs text-slate-400 font-medium">Hoàn 100% tiền nếu sai mô tả</p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider">
                Hỗ Trợ Tận Tình
              </h4>
              <p className="text-xs text-slate-400 font-medium">CSKH Zalo & Hotline trực tuyến</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links - Khoảng trắng rộng rãi, chỉ dùng Text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Cột 1: Thông tin thương hiệu (Chiếm 2 cột trên Desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight uppercase text-slate-100">
                MLBB <span className="text-gold-400">STORE</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                eSports
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-0 sm:pr-6">
              Hệ thống cung cấp tài khoản Mobile Legends: Bang Bang tự động hàng đầu
              Việt Nam. Đa dạng phân khúc từ Acc Sinh Viên giá rẻ, nick cày thuê,
              đến các tài khoản VIP sở hữu trọn bộ Skin Collector, Legend và KOF.
            </p>

            {/* Kênh kết nối mạng xã hội - Text links tối giản */}
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                Kết nối với chúng tôi
              </span>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                <a
                  href="#"
                  className="hover:text-gold-400 transition-colors"
                >
                  Facebook
                </a>
                <span className="text-slate-700">•</span>
                <a
                  href="#"
                  className="hover:text-gold-400 transition-colors"
                >
                  Telegram
                </a>
                <span className="text-slate-700">•</span>
                <a
                  href="#"
                  className="hover:text-gold-400 transition-colors"
                >
                  Zalo CSKH
                </a>
              </div>
            </div>
          </div>

          {/* Cột 2: Danh Mục Acc */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 pb-2 border-b border-navy-850">
              Danh Mục Tài Khoản
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/acc-vip"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Acc VIP - Thần Thoại
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-vip?type=collector"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Nick Full Skin Collector
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-sinh-vien"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Acc Sinh Viên 50k - 100k
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-trang-thong-tin"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Acc Trắng Thông Tin (TTT)
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu-cay-thue"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Dịch Vụ Cày Thuê Rank
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ Trợ & Chính Sách */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 pb-2 border-b border-navy-850">
              Hỗ Trợ & Quy Định
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/huong-dan-mua-hang"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Hướng dẫn mua nick
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Chính sách bảo hành & hoàn tiền
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan-su-dung"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/kiem-tra-don-hang"
                  className="text-slate-400 hover:text-slate-100 transition-colors"
                >
                  Kiểm tra đơn hàng đã mua
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên Hệ Trực Tiếp (Typography phân cấp rõ ràng) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 pb-2 border-b border-navy-850">
              Liên Hệ CSKH
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Hotline 24/7
                </span>
                <span className="font-semibold text-slate-100 hover:text-gold-400 transition-colors font-mono">
                  0988.123.456
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Zalo Hỗ Trợ
                </span>
                <span className="font-semibold text-slate-100 hover:text-gold-400 transition-colors font-mono">
                  0988.123.456 (Admin MLBB)
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Email CSKH
                </span>
                <span className="text-slate-300">hotro@mlbbstore.vn</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Thời Gian Làm Việc
                </span>
                <span className="text-slate-300">08:00 - 24:00 hàng ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán - Typography tối giản */}
        <div className="mt-12 pt-6 border-t border-navy-850 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400 font-medium">
            Hỗ trợ đa dạng phương thức thanh toán an toàn:
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded bg-navy-900 border border-navy-800 text-slate-300 font-medium">
              Chuyển khoản VietQR / Napas247
            </span>
            <span className="px-3 py-1 rounded bg-navy-900 border border-navy-800 text-slate-300 font-medium">
              Ví MoMo
            </span>
            <span className="px-3 py-1 rounded bg-navy-900 border border-navy-800 text-slate-300 font-medium">
              ZaloPay
            </span>
            <span className="px-3 py-1 rounded bg-navy-900 border border-navy-800 text-slate-300 font-medium">
              Thẻ cào tự động
            </span>
          </div>
        </div>
      </div>

      {/* Bản quyền Footer */}
      <div className="bg-navy-950 border-t border-navy-850/80 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            © 2026 <span className="text-gold-400 font-semibold">MLBB STORE</span>. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-[11px] text-slate-400">
            Hệ thống giao dịch tài khoản Mobile Legends: Bang Bang tự động 24/7.
          </p>
        </div>
      </div>
    </footer>
  );
}
