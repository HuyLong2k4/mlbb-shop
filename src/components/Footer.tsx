"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  RefreshCw,
  Headphones,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-850 relative">
      {/* 1. Value Proposition Ribbon - 4 cam kết vàng với icon trực quan */}
      <div className="border-b border-navy-850/80 bg-navy-900/40 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/70 border border-navy-800/80">
              <div className="p-2.5 rounded-lg bg-gold-500/10 text-gold-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider truncate">
                  100% Uy Tín
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                  Bảo hành trọn đời mọi nick
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/70 border border-navy-800/80">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider truncate">
                  Tự Động 24/7
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                  Giao dịch trong 30 giây
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/70 border border-navy-800/80">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider truncate">
                  Đổi Trả An Tâm
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                  Hoàn 100% nếu sai mô tả
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/70 border border-navy-800/80">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider truncate">
                  Hỗ Trợ Tận Tình
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                  Zalo & Hotline trực tuyến
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links - 4 Cột Cân Đối Hoàn Hảo (4 + 2 + 3 + 3 = 12 cols) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* CỘT 1 (4/12): THƯƠNG HIỆU & GIỚI THIỆU */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("reset-account-filters"));
                }
              }}
              className="inline-flex items-center gap-2.5 group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt={`${siteConfig.name} Logo`}
                className="w-9 h-9 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight uppercase text-slate-100">
                  MLBB <span className="text-gold-400">STORE</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  eSports
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-0 sm:pr-4">
              {siteConfig.description}
            </p>

            {/* Kênh kết nối mạng xã hội - Dạng Pills hiện đại */}
            <div className="pt-1 space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                Cộng đồng & Mạng xã hội
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <a
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-slate-300 hover:text-gold-400 border border-navy-800 hover:border-gold-500/40 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <a
                  href={siteConfig.contact.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-500/60 transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Zalo CSKH</span>
                </a>
                <a
                  href={siteConfig.socials.group}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-slate-300 hover:text-gold-400 border border-navy-800 hover:border-gold-500/40 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Cộng đồng</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* CỘT 2 (2/12): DANH MỤC ACC */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 pb-2 border-b border-navy-850">
              Danh Mục Tài Khoản
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/acc-vip"
                  className="text-slate-400 hover:text-gold-400 transition-colors block"
                >
                  Acc VIP (≥ 1 Triệu)
                </Link>
              </li>
              <li>
                <Link
                  href="/acc-sinh-vien"
                  className="text-slate-400 hover:text-emerald-400 transition-colors block"
                >
                  Acc Sinh Viên (&lt; 1 Triệu)
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/lien-he"
                  className="text-slate-400 hover:text-gold-400 transition-colors block"
                >
                  Trung Tâm Hỗ Trợ
                </Link>
              </li> */}
            </ul>
          </div>

          {/* CỘT 3 (3/12): LIÊN HỆ CSKH */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 pb-2 border-b border-navy-850">
              Liên Hệ Trực Tiếp
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                  Hotline CSKH (24/7)
                </span>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="font-mono font-bold text-slate-100 hover:text-gold-400 transition-colors text-sm"
                >
                  {siteConfig.contact.hotline}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                  Zalo Hỗ Trợ Trực Tuyến
                </span>
                <a
                  href={siteConfig.contact.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-slate-100 hover:text-gold-400 transition-colors text-sm flex items-center gap-1.5"
                >
                  <span>{siteConfig.contact.zaloDisplay}</span>
                  <span className="text-xs font-normal text-slate-400">({siteConfig.contact.zaloName})</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                  Hòm Thư Email
                </span>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                  Thời Gian Làm Việc
                </span>
                <span className="text-slate-300 text-xs">{siteConfig.contact.workingHours}</span>
              </div>
            </div>
          </div>

          {/* CỘT 4 (3/12): THẺ BANNER SHOP CHÍNH THỨC */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 pb-2 border-b border-navy-850">
              Thương Hiệu Shop
            </h3>

            {/* Banner nhỏ eSports với hiệu ứng sang trọng */}
            <div className="relative rounded-2xl overflow-hidden border border-gold-500/40 bg-navy-900 shadow-gold-sm hover:border-gold-400 transition-all duration-300 group">
              <Link href="/" className="block relative aspect-video w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/footer-banner.png"
                  alt={`${siteConfig.name} Official Banner`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-3 bg-gradient-to-b from-navy-900 to-navy-950 border-t border-navy-800 text-center space-y-2">
                <a
                  href={siteConfig.contact.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 transition-all flex items-center justify-center gap-1.5 shadow-sm block text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Zalo Ngay</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bản quyền Footer */}
      <div className="bg-navy-950 border-t border-navy-850/80 py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © 2026 <span className="text-gold-400 font-bold">{siteConfig.name}</span>. Bản quyền thuộc về {siteConfig.name}.
          </p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <span>Bảo mật 100%</span>
            <span>•</span>
            <span>Giao dịch an toàn</span>
            <span>•</span>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
