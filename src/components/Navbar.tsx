"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Acc VIP",
    href: "/acc-vip",
  },
  {
    name: "Acc Sinh viên",
    href: "/acc-sinh-vien",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Đổi nền Navbar khi cuộn chuột
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tự động đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Khóa cuộn màn hình khi menu mobile đang mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Xử lý khi nhấn vào Logo hoặc menu Trang chủ: Quay về trang chủ và kích hoạt reset toàn bộ bộ lọc
  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("reset-account-filters"));
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-navy-950/95 backdrop-blur-md border-b border-navy-800 shadow-lg shadow-black/30 py-3"
            : "bg-navy-950/80 backdrop-blur-sm border-b border-navy-850 py-4"
        }`}
      >
        {/* Top Announcement Bar - Phong cách tối giản chỉ dùng Typography */}
        <div className="hidden lg:block border-b border-navy-850/80 pb-2 mb-3 -mt-1 text-[11px] tracking-wide">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-gold-400 font-bold uppercase tracking-wider">
                Flash Sale:
              </span>
              <span className="text-slate-300">
                Toàn bộ sản phẩm giảm tối thiểu 25% duy nhất hôm nay
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-emerald-400">Hệ thống tự động 24/7</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400 hover:text-slate-200 transition-colors">
                Hotline: {siteConfig.contact.hotline}
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Thương Hiệu */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="MLBB STORE Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-100 font-sans">
                  MLBB <span className="text-gold-400">STORE</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 hidden sm:inline-block">
                  eSports Shop
                </span>
              </div>
            </Link>

            {/* Menu Desktop Nằm Ngang - Hoàn toàn là text sạch sẽ */}
            <div className="hidden md:flex items-center gap-1 lg:gap-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (item.href === "/") {
                        handleLogoClick();
                      }
                    }}
                    className={`relative px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold tracking-wide transition-all ${
                      isActive
                        ? "text-gold-400 font-bold bg-navy-900 border border-gold-500/30"
                        : "text-slate-300 hover:text-slate-100 hover:bg-navy-900/60"
                    }`}
                  >
                    <span>{item.name}</span>

                    {item.badge && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-navy-800 text-gold-400 border border-gold-500/30">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Nút Hành Động Desktop - Chỉ Admin tối giản */}
            <div className="hidden md:flex items-center gap-3">
              {/* Nút Admin */}
              <Link
                href="/admin"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 rounded-lg transition-all"
                title="Trang quản trị"
              >
                Admin
              </Link>
            </div>

            {/* Điều khiển Mobile (Hamburger) */}
            <div className="flex md:hidden items-center gap-2.5">
              <Link
                href="/admin"
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-300 bg-red-950/50 border border-red-500/40 rounded-lg"
              >
                Admin
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-navy-900 border border-navy-750 text-slate-200 hover:text-gold-400 focus:outline-none transition-colors"
                aria-label="Mở menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gold-400" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer - Tối giản, thanh lịch */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-navy-950 border-l border-navy-800 z-50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-navy-850">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="MLBB STORE Logo"
                className="w-7 h-7 object-contain rounded-md"
              />
              <span className="text-base font-black uppercase text-slate-100">
                MLBB <span className="text-gold-400">STORE</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (item.href === "/") {
                      handleLogoClick();
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "text-gold-400 font-bold bg-navy-900 border border-gold-500/30"
                      : "text-slate-300 hover:text-slate-100 hover:bg-navy-900/60"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-navy-850 text-gold-400 border border-navy-750">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-navy-850">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-red-300 bg-red-950/40 border border-red-500/40 block"
          >
            Quản Trị Admin
          </Link>
          <p className="text-[11px] text-center text-slate-400 pt-2 font-medium">
            Hotline: {siteConfig.contact.hotline} (24/7)
          </p>
        </div>
      </div>
    </>
  );
}
