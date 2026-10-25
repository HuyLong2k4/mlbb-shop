import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Clock,
  ShieldCheck,
  Send,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-100">
          Trung Tâm Hỗ Trợ & <span className="text-gold-gradient">Liên Hệ CSKH</span>
        </h1>
        <p className="text-sm text-slate-400">
          Đội ngũ kỹ thuật viên và chăm sóc khách hàng trực tuyến 24/7. Hỗ trợ giải đáp
          thắc mắc giao dịch, bảo hành tài khoản, tư vấn mua nick MLBB phù hợp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          {/* Card 1: Hotline */}
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="p-5 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition-colors flex items-start gap-4 group"
          >
            <div className="p-3 rounded-lg bg-gold-500/10 text-gold-400 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">
                Hotline Khẩn Cấp
              </div>
              <div className="text-lg font-black text-slate-100 group-hover:text-gold-400 transition-colors mt-0.5 font-mono">
                {siteConfig.contact.hotline}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Nhận cuộc gọi: {siteConfig.contact.workingHours}
              </div>
            </div>
          </a>

          {/* Card 2: Zalo */}
          <a
            href={siteConfig.contact.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-navy-900 border border-navy-800 hover:border-blue-500/50 transition-colors flex items-start gap-4 group"
          >
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">
                Zalo Hỗ Trợ Trực Tuyến
              </div>
              <div className="text-lg font-black text-slate-100 group-hover:text-blue-400 transition-colors mt-0.5 font-mono">
                {siteConfig.contact.zaloDisplay} ({siteConfig.contact.zaloName})
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {siteConfig.contact.supportResponseTime}
              </div>
            </div>
          </a>

          {/* Card 3: Fanpage */}
          <a
            href={siteConfig.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-xl bg-navy-900 border border-navy-800 hover:border-indigo-500/50 transition-colors flex items-start gap-4 group"
          >
            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Facebook className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">
                Fanpage Facebook
              </div>
              <div className="text-lg font-black text-slate-100 group-hover:text-indigo-400 transition-colors mt-0.5">
                {siteConfig.socials.facebookDisplay}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Cập nhật sự kiện & giveaway acc VIP
              </div>
            </div>
          </a>

          {/* Card 4: Bảo hành */}
          <div className="p-5 rounded-xl bg-navy-900 border border-navy-800 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">
                Cam Kết Bảo Hành
              </div>
              <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                {siteConfig.commitments.security}. {siteConfig.commitments.warranty}.
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-navy-900 border border-navy-800">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-100 mb-2">
            Gửi Yêu Cầu Hỗ Trợ
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Nếu bạn gặp sự cố khi thanh toán hoặc cần kiểm tra tình trạng tài khoản, vui lòng điền biểu mẫu dưới đây:
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Họ và tên của bạn
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Số điện thoại / Zalo
                </label>
                <input
                  type="text"
                  placeholder="0988..."
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mã tài khoản / Đơn hàng (Nếu có)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: VIP-9981"
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vấn đề cần hỗ trợ
                </label>
                <select className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-gold-500 transition-colors">
                  <option>Tư vấn chọn mua Acc</option>
                  <option>Hỗ trợ mua tài khoản qua Zalo</option>
                  <option>Yêu cầu bảo hành tài khoản</option>
                  <option>Hợp tác / Thanh lý nick</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nội dung chi tiết
              </label>
              <textarea
                rows={4}
                placeholder="Mô tả chi tiết yêu cầu của bạn..."
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <button
              type="button"
              className="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 shadow-gold-sm transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Tin Nhắn Ngay</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
