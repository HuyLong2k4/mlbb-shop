"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Shield,
  ShieldAlert,
  Zap,
  Flame,
  GraduationCap,
  PhoneCall,
  Sparkles,
  User,
  Wallet,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Acc VIP",
    href: "/acc-vip",
    badge: "MYTHIC",
    badgeColor: "bg-red-600 text-white border-red-400",
    icon: Flame,
  },
  {
    name: "Acc Sinh viên",
    href: "/acc-sinh-vien",
    badge: "TIẾT KIỆM",
    badgeColor: "bg-emerald-600 text-emerald-100 border-emerald-400",
    icon: GraduationCap,
  },
  {
    name: "Liên hệ",
    href: "/lien-he",
    icon: PhoneCall,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Change navbar background style on scroll
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

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-950/95 backdrop-blur-md border-b border-navy-700/80 shadow-lg shadow-black/40 py-2.5"
          : "bg-navy-900/85 backdrop-blur-sm border-b border-navy-800/60 py-3.5"
      }`}
    >
      {/* Top micro announcement bar (eSports vibe) */}
      <div className="hidden lg:block border-b border-navy-800/60 pb-1.5 mb-2 -mt-1 text-[11px] font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-gold-400 font-semibold uppercase">
              <Zap className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              Flash Sale Mùa Giải:
            </span>
            <span>Acc Rank Thần Thoại & Vinh Quang giảm 25% duy nhất hôm nay!</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Hệ thống tự động 24/7
            </span>
            <span className="text-slate-500">|</span>
            <span className="hover:text-gold-400 transition-colors cursor-pointer">
              Hotline: 1900.8888
            </span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* eSports Emblem Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-gold-400 via-amber-500 to-amber-700 p-0.5 shadow-gold-sm transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-navy-950 rounded-[6px] flex items-center justify-center relative overflow-hidden">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400 transition-transform duration-300 group-hover:rotate-6" />
                <div className="absolute inset-0 bg-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-2xl font-black tracking-wider uppercase text-slate-100 font-sans">
                  MLBB<span className="text-gold-gradient ml-1">STORE</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-black uppercase tracking-widest text-navy-950 bg-gold-400 rounded-sm">
                  PRO
                </span>
              </div>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold -mt-1 group-hover:text-gold-300 transition-colors">
                Shop Acc Mobile Legends
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-gold-400 bg-navy-800/90 shadow-sm border border-gold-500/30"
                      : "text-slate-300 hover:text-gold-400 hover:bg-navy-850/60"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-gold-400" />}
                  <span>{item.name}</span>

                  {/* Badge if available */}
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 font-extrabold uppercase rounded-full border shadow-sm ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator bar */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Admin Panel Quick Link */}
            <Link
              href="/admin"
              className="px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 rounded transition-all flex items-center gap-1 shadow-sm"
              title="Trang quản trị thêm tài khoản"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Nạp tiền / Nạp thẻ Button */}
            <Link
              href="/nap-the"
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-gold-300 bg-navy-800/80 hover:bg-navy-700/80 border border-gold-500/30 rounded transition-all flex items-center gap-1.5 shadow-sm hover:shadow-gold-sm"
            >
              <Wallet className="w-3.5 h-3.5 text-gold-400" />
              <span>Nạp Ví</span>
            </Link>

            {/* Login / Register Button (eSports Gold Metallic Button) */}
            <Link
              href="/auth/login"
              className="relative group overflow-hidden px-4 py-2 text-xs font-black uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 rounded shadow-gold-sm transition-all duration-300 hover:scale-[1.02] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
              <span className="absolute top-0 -left-full w-full h-full bg-white/25 transform skew-x-12 group-hover:left-full transition-all duration-700 ease-out" />
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/auth/login"
              className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-navy-950 bg-gold-400 rounded flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Vào</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg bg-navy-850 border border-navy-700 text-slate-200 hover:text-gold-400 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gold-400" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-[500px] opacity-100 mt-3 pt-3 border-t border-navy-800"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-1.5 pb-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-gold-400 bg-navy-800 border-l-4 border-gold-400"
                      : "text-slate-300 hover:text-gold-400 hover:bg-navy-850"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="w-4 h-4 text-gold-400" />}
                    <span>{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </Link>
              );
            })}

            {/* Mobile Action Links */}
            <div className="pt-3 mt-2 border-t border-navy-800/80 grid grid-cols-3 gap-2">
              <Link
                href="/admin"
                className="py-2.5 px-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider text-red-300 bg-red-950/40 border border-red-500/30 flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
              <Link
                href="/nap-the"
                className="py-2.5 px-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider text-gold-300 bg-navy-800 border border-gold-500/30 flex items-center justify-center gap-1"
              >
                <Wallet className="w-3.5 h-3.5 text-gold-400" />
                <span>Nạp Ví</span>
              </Link>
              <Link
                href="/auth/register"
                className="py-2.5 px-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đăng ký</span>
              </Link>
            </div>

            {/* Mobile Contact info snippet */}
            <div className="mt-2 text-center text-[11px] text-slate-400">
              Hotline hỗ trợ: <span className="text-gold-400 font-bold">1900.8888</span> (8h00 - 24h00)
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
