"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Crown,
  Trophy,
  Shield,
  Flame,
  Sparkles,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowLeft,
  Share2,
  MessageCircle,
  X,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import {
  mockAccounts,
  MLBBMockAccount,
  MLBBAccountRank,
} from "@/data/mockAccounts";

// Format tiền tệ VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

// Cấu hình huy hiệu Rank MLBB
const getRankBadgeInfo = (rank: MLBBAccountRank) => {
  switch (rank) {
    case "Chí Tôn":
      return {
        icon: Crown,
        badgeStyle: "bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-400 shadow-red-500/30",
        iconColor: "text-amber-300",
      };
    case "Vinh Quang Thần Thoại":
      return {
        icon: Trophy,
        badgeStyle: "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-navy-950 font-black border-yellow-300 shadow-gold-sm",
        iconColor: "text-navy-950",
      };
    case "Thần Thoại":
      return {
        icon: Trophy,
        badgeStyle: "bg-amber-500/20 text-gold-300 border-gold-500/50",
        iconColor: "text-gold-400",
      };
    case "Huyền Thoại":
      return {
        icon: Flame,
        badgeStyle: "bg-orange-500/20 text-orange-300 border-orange-500/40",
        iconColor: "text-orange-400",
      };
    case "Sử Thi":
    default:
      return {
        icon: Shield,
        badgeStyle: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        iconColor: "text-cyan-400",
      };
  }
};

// Thông tin tài khoản ngân hàng nhận thanh toán
const BANK_CONFIG = {
  bankId: "MB",
  bankName: "MB Bank (Ngân Hàng Quân Đội)",
  accountNumber: "0988123456",
  accountHolder: "MLBB STORE OFFICIAL",
  adminPhone: "0988123456", // Số Zalo CSKH
};

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params?.id as string;

  // Tìm tài khoản theo mã ID trong mock data
  const account = mockAccounts.find(
    (acc) => acc.id.toLowerCase() === accountId?.toLowerCase()
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // State điều khiển Modal thanh toán QR
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPaymentModalOpen(false);
      }
    };
    if (isPaymentModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Khóa cuộn trang khi modal mở
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isPaymentModalOpen]);

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-navy-850 border border-navy-700 flex items-center justify-center text-gold-400">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase text-slate-100">
          Không tìm thấy tài khoản #{accountId}
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ khám phá Acc khác</span>
        </Link>
      </div>
    );
  }

  const rankInfo = getRankBadgeInfo(account.rank);
  const RankIcon = rankInfo.icon;
  const isAvailable = account.status === "Còn hàng";
  const screenshots = account.screenshots || [];
  const currentScreenshot = screenshots[activeImageIndex] || {
    id: 1,
    title: "Ảnh chụp màn hình game",
    caption: "Chi tiết tài khoản in-game",
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Hàm sao chép thông tin chuyển khoản (STK, Số tiền, Nội dung CK)
  const handleCopyText = (text: string, key: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Cú pháp nội dung chuyển khoản
  const transferContent = `MUA ACC ${account.id}`;

  // URL VietQR tạo mã QR chuẩn Napas247 tự động điền STK, Số tiền và Nội dung
  const qrCodeUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${account.price}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(BANK_CONFIG.accountHolder)}`;

  // Tin nhắn soạn sẵn gửi cho Admin
  const adminMessage = `Chào admin, tôi muốn mua tài khoản MLBB mã số ID: ${account.id}`;

  // Xử lý khi bấm nút "Liên hệ Admin"
  const handleContactAdmin = () => {
    if (typeof window !== "undefined") {
      // 1. Tự động sao chép câu tin nhắn vào clipboard
      navigator.clipboard.writeText(adminMessage);

      // 2. Mở Zalo CSKH trong tab mới
      // Định dạng mở Zalo trực tiếp với số điện thoại admin
      const zaloUrl = `https://zalo.me/${BANK_CONFIG.adminPhone}`;
      window.open(zaloUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-gold-400 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/acc-vip" className="hover:text-gold-400 transition-colors">Danh sách Acc</Link>
          <span>/</span>
          <span className="text-gold-400 font-mono font-bold">#{account.id}</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 hover:border-gold-500/40 text-slate-300 hover:text-gold-400 transition-colors text-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? "Đã sao chép liên kết!" : "Chia sẻ Acc"}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2 CỘT CHÍNH: CỘT TRÁI (CAROUSEL ẢNH) & CỘT PHẢI (CHỈ SỐ & NÚT MUA VÀNG) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================================================================== */}
        {/* CỘT TRÁI: CAROUSEL ẢNH CHỤP IN-GAME PROOF (lg:col-span-7)             */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Màn hình hiển thị ảnh chính */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-navy-950 border border-navy-700/80 shadow-navy-card group">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70 z-10 pointer-events-none" />

            {/* Khung mô phỏng In-Game Screenshot hoặc Ảnh Cloudinary thực tế */}
            {currentScreenshot.imageUrl ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentScreenshot.imageUrl}
                  alt={currentScreenshot.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 z-20">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-gold-400 border border-gold-500/40">
                    #{account.id} • {currentScreenshot.title}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-slate-300">
                  Ảnh {activeImageIndex + 1} / {screenshots.length}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 relative overflow-hidden">
                <div className="relative z-20 flex items-center justify-between text-xs text-slate-300 border-b border-navy-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-gold-300 font-bold uppercase text-[11px]">
                      IN-GAME PROOF #{account.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>MS: 24ms</span>
                    <span>FPS: 120</span>
                  </div>
                </div>

                {/* Trung tâm: Huy hiệu & Tiêu đề ảnh */}
                <div className="relative z-20 my-auto text-center space-y-3 py-6">
                  <div className="inline-flex p-4 rounded-2xl bg-navy-900/90 border border-gold-500/40 shadow-gold-sm">
                    <RankIcon className={`w-14 h-14 ${rankInfo.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase text-slate-100 tracking-wide">
                      {currentScreenshot.title}
                    </h3>
                    <p className="text-xs text-gold-300 mt-1 max-w-md mx-auto font-medium">
                      {currentScreenshot.caption}
                    </p>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-navy-950/90 border border-navy-700 text-[11px] font-mono text-slate-400">
                    Ảnh chụp bảo chứng thực tế tại MLBB STORE
                  </div>
                </div>

                {/* Watermark dưới cùng */}
                <div className="relative z-20 flex items-center justify-between text-[11px] text-slate-400 border-t border-navy-700/60 pt-2">
                  <span className="text-gold-400 font-bold tracking-widest uppercase">
                    mlbbstore.vn • Uy tín 100%
                  </span>
                  <span className="font-mono">
                    Ảnh {activeImageIndex + 1} / {screenshots.length}
                  </span>
                </div>
              </div>
            )}

            {/* Nút điều hướng Carousel */}
            {screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-navy-950/80 hover:bg-gold-500 hover:text-navy-950 text-slate-200 border border-navy-700 transition-all opacity-80 group-hover:opacity-100 shadow-lg cursor-pointer"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-navy-950/80 hover:bg-gold-500 hover:text-navy-950 text-slate-200 border border-navy-700 transition-all opacity-80 group-hover:opacity-100 shadow-lg cursor-pointer"
                  aria-label="Ảnh kế tiếp"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dải ảnh Thumbnails chuyển nhanh */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {screenshots.map((shot, idx) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden p-1.5 text-left transition-all border cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-gold-400 ring-2 ring-gold-400/40 bg-navy-850 shadow-gold-sm"
                    : "border-navy-800 bg-navy-900 hover:border-navy-700 opacity-70 hover:opacity-100"
                }`}
              >
                {shot.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shot.imageUrl}
                    alt={shot.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-full flex flex-col justify-between text-[10px]">
                    <span className="font-mono font-bold text-gold-400">#0{idx + 1}</span>
                    <span className="line-clamp-2 text-slate-300 font-semibold leading-tight">
                      {shot.title}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Cam kết hỗ trợ */}
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Đổi Pass tức thì</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bảo hành vĩnh viễn</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 col-span-2 sm:col-span-1">
              <Zap className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Giao nick 30 giây</span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CỘT PHẢI: CHỈ SỐ CHI TIẾT & NÚT MUA VÀNG (lg:col-span-5)              */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Thông Tin Acc */}
          <div className="space-y-3 pb-4 border-b border-navy-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-navy-900 text-gold-400 border border-gold-500/40">
                #{account.id}
              </span>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border shadow-sm ${rankInfo.badgeStyle}`}>
                <RankIcon className="w-3.5 h-3.5" />
                <span>{account.rank}</span>
              </div>

              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Còn hàng
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/40">
                  <XCircle className="w-3.5 h-3.5" />
                  Đã bán
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-100 leading-tight">
              {account.title}
            </h1>

            {/* Khung Giá bán */}
            <div className="p-4 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Giá bán công khai
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gold-400 font-mono tracking-tight">
                  {formatVND(account.price)}
                </div>
              </div>

              {account.originalPrice && (
                <div className="text-right">
                  <div className="text-xs text-slate-500 line-through">
                    {formatVND(account.originalPrice)}
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                    Tiết kiệm {Math.round(((account.originalPrice - account.price) / account.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================== */}
          {/* CÁC CHỈ SỐ CHI TIẾT (TỈ LỆ THẮNG, BẢNG NGỌC, SKIN HIẾM)             */}
          {/* =================================================================== */}
          <div className="space-y-4">
            {/* 1. Tỉ lệ thắng (Winrate) */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Tỉ Lệ Thắng (Winrate)</span>
                </div>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {account.winRate.overall}
                </span>
              </div>

              <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-navy-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${parseFloat(account.winRate.overall) || 65}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-navy-800/80">
                <div className="text-slate-400">
                  Tổng số trận: <strong className="text-slate-200 font-mono">{account.winRate.totalMatches.toLocaleString("vi-VN")} trận</strong>
                </div>
                <div className="text-slate-400 text-right">
                  Winrate Rank: <strong className="text-gold-400 font-mono">{account.winRate.rankWinRate}</strong>
                </div>
              </div>
            </div>

            {/* 2. Bảng ngọc (Emblems) */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span>Bảng Ngọc & Bổ Trợ (Emblems)</span>
                </div>
                <span className="text-[11px] font-bold text-gold-400 uppercase">
                  {account.emblems.length} Bảng chính
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {account.emblems.map((emblem, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-950 border border-navy-700 text-slate-200 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span>{emblem}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Danh sách Skin hiếm */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Danh Sách Trang Phục Hiếm</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {account.skinCount} trang phục
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {account.highlightSkins.map((skin, idx) => {
                  const isLegend = skin.includes("Legend");
                  const isCollector = skin.includes("Collector");
                  const isKOF = skin.includes("KOF");

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                        isLegend
                          ? "bg-amber-500/10 border-gold-500/50 text-gold-300 font-bold"
                          : isCollector
                          ? "bg-purple-500/10 border-purple-500/40 text-purple-300 font-semibold"
                          : isKOF
                          ? "bg-red-500/10 border-red-500/40 text-red-300 font-semibold"
                          : "bg-navy-950 border-navy-800 text-slate-300"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-gold-400" />
                      <span className="truncate">{skin}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Tình trạng bảo mật & Điểm uy tín */}
            <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-200">
                  Điểm uy tín: <span className="text-emerald-400 font-mono">{account.reputationScore}/100</span> • {account.securityInfo}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Hệ thống tự động chuyển giao tài khoản ngay sau khi thanh toán.
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* NÚT CTA LỚN MÀU VÀNG CÓ CHỮ 'MUA NGAY'                               */}
          {/* =================================================================== */}
          <div className="space-y-3 pt-2">
            {isAvailable ? (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-4 px-6 rounded-xl text-base sm:text-lg font-black uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 shadow-gold-md hover:shadow-gold-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-3 cursor-pointer group"
              >
                <ShoppingCart className="w-6 h-6 text-navy-950 transition-transform group-hover:scale-110" />
                <span>MUA NGAY</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 rounded-xl text-base font-bold uppercase tracking-wider bg-navy-800 text-slate-500 border border-navy-700 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                <span>TÀI KHOẢN ĐÃ ĐƯỢC BÁN</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-gold-400" />
                Nhận mật khẩu sau 30s
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={handleContactAdmin}
                className="flex items-center gap-1 hover:text-gold-400 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                Chat Zalo hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL THANH TOÁN QR & THÔNG TIN CHUYỂN KHOẢN                            */}
      {/* ========================================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop tối mờ click để đóng */}
          <div
            onClick={() => setIsPaymentModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-navy-900 border border-gold-500/40 rounded-2xl shadow-gold-lg z-10 overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-navy-800 bg-navy-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-slate-100 tracking-wide">
                    Thanh Toán Mua Tài Khoản
                  </h3>
                  <div className="text-xs text-gold-300 font-mono">
                    Mã đơn hàng: #{account.id}
                  </div>
                </div>
              </div>

              {/* Nút đóng X */}
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer"
                aria-label="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung Modal */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Khung chứa ảnh mã QR VietQR */}
              <div className="text-center space-y-2">
                <div className="relative inline-block p-3 rounded-2xl bg-white shadow-md border-2 border-gold-500/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt={`VietQR thanh toán cho tài khoản ${account.id}`}
                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto"
                    loading="eager"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-navy-950 text-gold-400 text-[10px] font-bold border border-gold-500/40 whitespace-nowrap">
                    Quét bằng mọi ứng dụng Ngân hàng / MoMo
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Mở App Ngân hàng hoặc Ví điện tử để quét mã thanh toán tự động
                </p>
              </div>

              {/* Bảng chi tiết thông tin chuyển khoản */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2.5 text-xs">
                {/* 1. Ngân hàng */}
                <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-bold text-slate-100">
                    {BANK_CONFIG.bankName}
                  </span>
                </div>

                {/* 2. Số tài khoản */}
                <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-gold-400 text-sm">
                      {BANK_CONFIG.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(BANK_CONFIG.accountNumber, "accountNumber")
                      }
                      className="p-1 rounded bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-gold-400 transition-colors"
                      title="Sao chép số tài khoản"
                    >
                      {copiedKey === "accountNumber" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Chủ tài khoản */}
                <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-bold text-slate-200">
                    {BANK_CONFIG.accountHolder}
                  </span>
                </div>

                {/* 4. Số tiền cần chuyển */}
                <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
                  <span className="text-slate-400">Số tiền:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-gold-400 text-sm sm:text-base">
                      {formatVND(account.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(account.price.toString(), "amount")
                      }
                      className="p-1 rounded bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-gold-400 transition-colors"
                      title="Sao chép số tiền"
                    >
                      {copiedKey === "amount" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 5. Nội dung chuyển khoản (BẮT BUỘC) */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-400 font-semibold">
                    Nội dung CK:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-xs sm:text-sm">
                      {transferContent}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(transferContent, "content")
                      }
                      className="p-1 rounded bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-gold-400 transition-colors"
                      title="Sao chép nội dung chuyển khoản"
                    >
                      {copiedKey === "content" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Lưu ý thanh toán */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Lưu ý:</strong> Vui lòng giữ nguyên nội dung chuyển khoản{" "}
                  <code className="text-white font-mono font-bold">
                    {transferContent}
                  </code>{" "}
                  để hệ thống tự động gửi thông tin đăng nhập trong 30 giây.
                </span>
              </div>

              {/* =================================================================== */}
              {/* NÚT LIÊN HỆ ADMIN (CHUYỂN HƯỚNG ZALO VỚI NỘI DUNG TẠO SẴN)          */}
              {/* =================================================================== */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleContactAdmin}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-slate-100 bg-navy-800 hover:bg-navy-750 border border-gold-500/50 hover:border-gold-400 transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-gold-sm cursor-pointer group"
                >
                  <MessageCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>LIÊN HỆ ADMIN</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Tin nhắn tự động gửi:{" "}
                  <span className="italic text-slate-300">
                    &quot;{adminMessage}&quot;
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
