import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Headphones,
  CreditCard,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Send,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 relative overflow-hidden">
      {/* Background ambient gold/blue glow */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-navy-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Trust Badges / Value Proposition Ribbon */}
      <div className="border-b border-navy-800/80 bg-navy-900/60 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-850/50 border border-navy-800 hover:border-gold-500/40 transition-colors">
              <div className="p-2.5 rounded-md bg-gold-500/10 text-gold-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  100% Uy Tín
                </h4>
                <p className="text-xs text-slate-400">Bảo hành trọn đời nick</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-850/50 border border-navy-800 hover:border-gold-500/40 transition-colors">
              <div className="p-2.5 rounded-md bg-gold-500/10 text-gold-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Tự Động 24/7
                </h4>
                <p className="text-xs text-slate-400">Giao dịch trong 30 giây</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-850/50 border border-navy-800 hover:border-gold-500/40 transition-colors">
              <div className="p-2.5 rounded-md bg-gold-500/10 text-gold-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Đổi Trả An Tâm
                </h4>
                <p className="text-xs text-slate-400">Hoàn tiền nếu sai mô tả</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-navy-850/50 border border-navy-800 hover:border-gold-500/40 transition-colors">
              <div className="p-2.5 rounded-md bg-gold-500/10 text-gold-400">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Hỗ Trợ Tận Tình
                </h4>
                <p className="text-xs text-slate-400">CSKH Zalo / Fanpage 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Col 1: Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-black tracking-wider uppercase text-slate-100">
                MLBB<span className="text-gold-gradient ml-1">STORE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-navy-950 bg-gold-400 rounded">
                ESPORTS
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-0 sm:pr-4">
              Hệ thống cung cấp tài khoản Mobile Legends: Bang Bang hàng đầu Việt
              Nam. Đa dạng phân khúc từ Acc Sinh Viên giá rẻ, nick cày thuê, cho
              đến các tài khoản VIP sở hữu trọn bộ Skin Collector, Legend, Prime.
            </p>

            {/* Social channels */}
            <div className="pt-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-300 block mb-2">
                Kết nối với chúng tôi
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="w-9 h-9 rounded-md bg-navy-850 border border-navy-700 hover:border-gold-400 text-slate-300 hover:text-gold-400 flex items-center justify-center transition-colors"
                  aria-label="Facebook Fanpage"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-md bg-navy-850 border border-navy-700 hover:border-gold-400 text-slate-300 hover:text-gold-400 flex items-center justify-center transition-colors"
                  aria-label="Telegram Channel"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-md bg-navy-850 border border-navy-700 hover:border-gold-400 text-slate-300 hover:text-gold-400 flex items-center justify-center transition-colors"
                  aria-label="Zalo CSKH"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Danh Mục Acc */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 pb-2 border-b border-navy-800">
              Danh Mục Tài Khoản
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/acc-vip"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Acc VIP - Thần Thoại</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-vip?type=collector"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Nick Full Skin Collector</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-sinh-vien"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Acc Sinh Viên 50k - 100k</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-trang-thong-tin"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Acc Trắng Thông Tin (TTT)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dich-vu-cay-thue"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Dịch Vụ Cày Thuê Rank</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hỗ Trợ & Chính Sách */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 pb-2 border-b border-navy-800">
              Hỗ Trợ & Quy Định
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/huong-dan-mua-hang"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Hướng dẫn mua nick</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/nap-the"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Biểu phí nạp thẻ cào & ATM</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Chính sách bảo hành & hoàn tiền</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan-su-dung"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Điều khoản dịch vụ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kiem-tra-don-hang"
                  className="hover:text-gold-400 flex items-center gap-1.5 transition-colors group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400" />
                  <span>Kiểm tra đơn hàng đã mua</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Liên Hệ Trực Tiếp */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-400 mb-4 pb-2 border-b border-navy-800">
              Liên Hệ CSKH
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs">Hotline 24/7:</div>
                  <div className="font-bold text-slate-100 hover:text-gold-400 transition-colors">
                    0988.123.456
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs">Zalo Hỗ Trợ:</div>
                  <div className="font-bold text-slate-100 hover:text-gold-400 transition-colors">
                    0988.123.456 (Admin MLBB)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs">Email công việc:</div>
                  <div className="text-slate-300">hotro@mlbbstore.vn</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-xs">Thời gian làm việc:</div>
                  <div className="text-slate-300">08:00 - 24:00 hàng ngày</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mt-10 pt-6 border-t border-navy-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-medium">
            Hỗ trợ đa dạng phương thức thanh toán an toàn:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold bg-navy-850 border border-navy-700 rounded text-slate-300">
              Vietcombank / MB / Tech
            </span>
            <span className="px-2.5 py-1 text-xs font-bold bg-[#A50064]/20 border border-[#A50064]/40 rounded text-pink-300">
              Ví MoMo
            </span>
            <span className="px-2.5 py-1 text-xs font-bold bg-[#0068FF]/20 border border-[#0068FF]/40 rounded text-blue-300">
              ZaloPay
            </span>
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 border border-amber-500/40 rounded text-amber-300">
              Thẻ Cào Auto
            </span>
          </div>
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="bg-navy-950/95 border-t border-navy-800/60 py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            © 2026 <span className="text-gold-400 font-bold">MLBB STORE</span>. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-[11px] text-slate-400">
            Trang web thương mại điện tử chuyên cung cấp tài khoản game do cộng đồng game thủ vận hành.
          </p>
        </div>
      </div>
    </footer>
  );
}
