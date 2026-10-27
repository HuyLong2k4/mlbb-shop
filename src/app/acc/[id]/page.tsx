"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getOptimizedImageUrl } from "@/lib/imageOptimizer";
import {
  Shield,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowLeft,
  Share2,
  MessageCircle,
  RefreshCw,
  Maximize2,
  X,
} from "lucide-react";
import { AccountData } from "@/types/account";
import { siteConfig } from "@/config/site";

// Format tiền tệ VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

export default function AccountDetailPage() {
  const params = useParams();
  const accountId = params?.id as string;

  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Lắng nghe phím ESC để đóng modal zoom ảnh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tải chi tiết tài khoản từ API MongoDB (/api/accounts/[id])
  useEffect(() => {
    if (!accountId) return;

    let isMounted = true;
    const fetchAccountDetail = async () => {
      setLoading(true);
      try {
        let cleanId = accountId;
        try {
          cleanId = decodeURIComponent(accountId);
        } catch {}

        const res = await fetch(`/api/accounts/${encodeURIComponent(cleanId)}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (res.ok && data.success && data.data && isMounted) {
          setAccount(data.data);
        } else if (isMounted) {
          setAccount(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải từ API MongoDB:", err);
        if (isMounted) {
          setAccount(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAccountDetail();

    return () => {
      isMounted = false;
    };
  }, [accountId]);

  // Trạng thái đang tải dữ liệu
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-gold-400 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Đang tải thông tin tài khoản #{accountId}...
        </p>
      </div>
    );
  }

  // Trạng thái không tìm thấy tài khoản
  if (!account) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-navy-850 border border-navy-700 flex items-center justify-center text-gold-400">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase text-slate-100">
          Không tìm thấy tài khoản #{accountId}
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Tài khoản này có thể đã bị xóa hoặc mã ID không chính xác. Vui lòng quay lại danh sách để khám phá các tài khoản khác.
        </p>
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

  const isAvailable = account.status === "Còn hàng";

  // Chuẩn hóa danh sách ảnh (ưu tiên screenshots, fallback sang images URL)
  const screenshots =
    account.screenshots && account.screenshots.length > 0
      ? account.screenshots
      : account.images && account.images.length > 0
      ? account.images.map((url: string, idx: number) => ({
          id: idx + 1,
          title: `Ảnh in-game #${idx + 1}`,
          caption: `Chi tiết tài khoản #${account.id}`,
          imageUrl: url,
        }))
      : [];

  const currentScreenshot = screenshots[activeImageIndex] || {
    id: 1,
    title: "Ảnh chụp màn hình game",
    caption: "Chi tiết tài khoản in-game",
    imageUrl: "",
  };

  const highlightSkinsList: string[] = Array.isArray(account.highlightSkins)
    ? account.highlightSkins
    : [];

  // Xác định tình trạng Bảng ngọc: "Full" hoặc "Gần Full"
  const emblemStatus: string =
    typeof account.emblems === "string"
      ? account.emblems
      : Array.isArray(account.emblems) && account.emblems.length > 0
      ? account.emblems.some((e: string) =>
          String(e).toLowerCase().includes("gần full") ||
          String(e).includes("55") ||
          String(e).includes("52") ||
          String(e).includes("48")
        )
        ? "Gần Full"
        : "Full"
      : "Full";

  const isFullEmblems =
    emblemStatus.toLowerCase().includes("full") &&
    !emblemStatus.toLowerCase().includes("gần");

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

  // Tin nhắn soạn sẵn gửi cho người bán qua Zalo
  const adminMessage = `Chào shop, tôi muốn mua tài khoản MLBB mã ID: #${account.id} - Giá: ${formatVND(account.price || 0)}`;

  // Khi ấn Mua Ngay -> Chuyển thẳng đến Zalo người bán
  const handleBuyNow = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(adminMessage);
      window.open(siteConfig.contact.zaloUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/acc-vip" className="hover:text-gold-400 transition-colors">
            Danh sách Acc
          </Link>
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
      {/* BỐ CỤC CHÍNH: DESKTOP 2 CỘT (ẢNH TRÁI, INFO PHẢI) - MOBILE XẾP CHỒNG     */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ===================================================================== */}
        {/* CỘT 1 (Ở TRÊN TRÊN MOBILE, BÊN TRÁI TRÊN DESKTOP): CAROUSEL ẢNH       */}
        {/* ===================================================================== */}
        <div className="w-full lg:col-span-7 space-y-3 sm:space-y-4 order-1">
          {/* Màn hình hiển thị ảnh chính */}
          <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black/95 border border-navy-700/80 shadow-navy-card group flex items-center justify-center">
            {/* Khung mô phỏng In-Game Screenshot hoặc Ảnh Cloudinary thực tế */}
            {currentScreenshot.imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={getOptimizedImageUrl(currentScreenshot.imageUrl, { width: 1200 })}
                  alt={currentScreenshot.title || `Ảnh #${account.id}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain cursor-zoom-in"
                  onClick={() => setZoomImage(currentScreenshot.imageUrl || null)}
                  priority
                  unoptimized
                />
                <div className="absolute top-2.5 left-2.5 z-20">
                  <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-black/85 text-gold-400 border border-gold-500/40 backdrop-blur-sm">
                    #{account.id} • {currentScreenshot.title}
                  </span>
                </div>

                {/* Nút Xem ảnh phóng to (Zoom) */}
                <button
                  type="button"
                  onClick={() => setZoomImage(currentScreenshot.imageUrl || null)}
                  className="absolute bottom-2.5 left-2.5 z-20 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/80 hover:bg-gold-500 hover:text-navy-950 text-slate-200 border border-navy-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Click để phóng to ảnh xem chi tiết"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Phóng to</span>
                </button>

                {screenshots.length > 1 && (
                  <div className="absolute bottom-2.5 right-2.5 z-20 px-2.5 py-1 rounded text-[10px] font-bold bg-black/85 text-slate-200 border border-navy-800">
                    Ảnh {activeImageIndex + 1} / {screenshots.length}
                  </div>
                )}
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
                    <Award className="w-14 h-14 text-gold-400" />
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
                    Ảnh chụp bảo chứng thực tế tại SHOP QAUT
                  </div>
                </div>

                {/* Watermark dưới cùng */}
                <div className="relative z-20 flex items-center justify-between text-[11px] text-slate-400 border-t border-navy-700/60 pt-2">
                  <span className="text-gold-400 font-bold tracking-widest uppercase">
                    mlbbstore.vn • Uy tín 100%
                  </span>
                  <span className="font-mono">
                    Ảnh {activeImageIndex + 1} / {Math.max(screenshots.length, 1)}
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
          {screenshots.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {screenshots.map((shot: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden p-1.5 text-left transition-all border cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-gold-400 ring-2 ring-gold-400/40 bg-navy-850 shadow-gold-sm"
                      : "border-navy-800 bg-navy-900 hover:border-navy-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  {shot.imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={getOptimizedImageUrl(shot.imageUrl, { width: 240 })}
                        alt={shot.title || `Ảnh ${idx + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover bg-black/80 rounded-lg"
                        unoptimized
                      />
                    </div>
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
          )}

          {/* Cam kết hỗ trợ */}
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Hướng dẫn từ A-Z</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 col-span-2 sm:col-span-1">
              <Zap className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Phục vụ nhiệt tình</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 col-span-2 sm:col-span-1">
              <Zap className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Hỗ trợ lên đời acc</span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CỘT 2 (Ở DƯỚI TRÊN MOBILE, BÊN PHẢI TRÊN DESKTOP): THÔNG TIN & MUA     */}
        {/* ===================================================================== */}
        <div className="w-full lg:col-span-5 space-y-5 sm:space-y-6 order-2">
          {/* Header Thông Tin Acc */}
          <div className="space-y-3 pb-4 border-b border-navy-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-navy-900 text-gold-400 border border-gold-500/40">
                #{account.id}
              </span>

              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {account.collectionTier || "Sưu tập truyền kỳ"}
              </span>

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

            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-100 leading-tight">
              {account.title}
            </h1>

            {/* Khung Giá bán */}
            <div className="p-4 rounded-xl bg-navy-900 border border-gold-500/30 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  Giá bán công khai
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gold-400 font-mono tracking-tight">
                  {formatVND(account.price || 0)}
                </div>
              </div>

              {account.originalPrice && account.originalPrice > account.price && (
                <div className="text-right">
                  <div className="text-xs text-slate-500 line-through">
                    {formatVND(account.originalPrice)}
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                    Tiết kiệm{" "}
                    {Math.round(
                      ((account.originalPrice - account.price) / account.originalPrice) * 100
                    )}
                    %
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================== */}
          {/* CÁC CHỈ SỐ CHI TIẾT (BẢNG NGỌC, SKIN HIẾM)                        */}
          {/* =================================================================== */}
          <div className="space-y-4">
            {/* Tình trạng Bảng ngọc (Emblems) */}
            <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span>Tình Trạng Bảng Ngọc</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Xem chi tiết ở ảnh in-game
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {isFullEmblems ? (
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Full Bảng Ngọc (Max)</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Gần Full Bảng Ngọc</span>
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {isFullEmblems
                    ? "Tất cả các nhánh bảng ngọc bổ trợ đã đạt cấp tối đa."
                    : "Đã nâng cấp hầu hết các nhánh ngọc bổ trợ quan trọng."}
                </span>
              </div>
            </div>

            {/* 3. Danh sách Skin hiếm */}
            {highlightSkinsList.length > 0 && (
              <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Danh Sách Trang Phục Hiếm</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {account.skinCount || highlightSkinsList.length} trang phục
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {highlightSkinsList.map((skin: string, idx: number) => {
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
            )}

            {/* 4. Tình trạng bảo mật & Điểm uy tín */}
            <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-slate-200">
                  Điểm uy tín:{" "}
                  <span className="text-emerald-400 font-mono">
                    {account.reputationScore ?? 100}/100
                  </span>{" "}
                  • {account.securityInfo || "Thông Tin Đẹp"}
                </div>
                <div className="text-slate-400 text-[11px]">
                  {account.description ||
                    "Hệ thống tự động chuyển giao tài khoản ngay sau khi thanh toán."}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* NÚT MUA NGAY - CHUYỂN THẲNG ĐẾN ZALO NGƯỜI BÁN                      */}
          {/* =================================================================== */}
          <div className="space-y-3 pt-3">
            {isAvailable ? (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-xl text-base sm:text-lg font-black uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 shadow-gold-md hover:shadow-gold-lg transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-navy-950" />
                <span>MUA NGAY (CHUYỂN ĐẾN ZALO)</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 rounded-xl text-base font-bold uppercase tracking-wider bg-navy-850 text-slate-500 border border-navy-750 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                <span>TÀI KHOẢN ĐÃ ĐƯỢC BÁN</span>
              </button>
            )}

            <div className="text-center space-y-1.5 pt-1">
              <p className="text-xs text-slate-300">
                Bấm <strong className="text-gold-400">Mua Ngay</strong> sẽ chuyển thẳng đến Zalo người bán để giao dịch trực tiếp & nhận acc ngay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PHÓNG TO ẢNH FULL SCREEN */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-7xl max-h-[92vh] w-full h-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 z-50 p-2.5 rounded-full bg-navy-900/90 hover:bg-red-500 text-white border border-navy-700 transition-colors cursor-pointer shadow-lg"
              title="Đóng (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={getOptimizedImageUrl(zoomImage, { width: 1920 })}
              alt="Ảnh in-game kích thước đầy đủ"
              width={1600}
              height={900}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-navy-800"
              onClick={(e) => e.stopPropagation()}
              unoptimized
            />
          </div>
          <div className="text-center text-xs text-slate-400 mt-2">
            Nhấn vào bất kỳ đâu hoặc bấm ESC để đóng ảnh
          </div>
        </div>
      )}
    </div>
  );
}
