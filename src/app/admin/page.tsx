"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Eye,
  Database,
  List,
  LogOut,
  UploadCloud,
  ImageIcon,
  X,
  Sparkles,
} from "lucide-react";

interface AccountFormData {
  id: string;
  title: string;
  price: number | "";
  originalPrice: number | "";
  rank: string;
  heroCount: number | "";
  skinCount: number | "";
  highlightSkins: string; // Phân cách bằng dấu phẩy
  status: string;
  winRateOverall: string;
  winRateMatches: number | "";
  emblems: string; // Phân cách bằng dấu phẩy
  description: string;
}

const initialForm: AccountFormData = {
  id: "",
  title: "",
  price: "",
  originalPrice: "",
  rank: "Thần Thoại",
  heroCount: 80,
  skinCount: 100,
  highlightSkins: "Gusion - Cosmic Gleam (Legend), Chou - Iori Yagami (KOF)",
  status: "Còn hàng",
  winRateOverall: "65.5%",
  winRateMatches: 1500,
  emblems: "Sát Thủ Lv.60, Đấu Sĩ Lv.60, Xạ Thủ Lv.55",
  description: "Tài khoản chính chủ trắng thông tin, bảo hành đổi trả vĩnh viễn.",
};

export default function AdminPage() {
  const [formData, setFormData] = useState<AccountFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State quản lý danh sách URL ảnh Cloudinary đã tải lên
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Danh sách tài khoản hiện có trong Database để đối soát nhanh
  const [existingAccounts, setExistingAccounts] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Tải danh sách tài khoản hiện có
  const loadExistingAccounts = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/accounts?status=ALL&limit=100", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setExistingAccounts(data.data || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadExistingAccounts();
  }, []);

  // Xử lý thay đổi input văn bản/số
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Xử lý chọn nhiều file ảnh & tự động upload lên Cloudinary qua /api/upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const uploadFormData = new FormData();
    Array.from(files).forEach((file) => {
      uploadFormData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || "Lỗi khi upload ảnh lên Cloudinary. Vui lòng kiểm tra API Keys."
        );
      }

      // Thêm các URL mới vào danh sách ảnh hiện tại
      setUploadedImages((prev) => [...prev, ...result.urls]);
      setSuccessMsg(`📸 Đã upload thành công ${result.urls.length} ảnh lên Cloudinary!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Quá trình upload ảnh gặp sự cố.");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input để cho phép chọn lại
    }
  };

  // Xóa ảnh đã upload khỏi danh sách trước khi lưu
  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Form: Lưu toàn bộ thông tin tài khoản và mảng URL ảnh vào MongoDB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const skinsArray = formData.highlightSkins
      ? formData.highlightSkins
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    const emblemsArray = formData.emblems
      ? formData.emblems
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    // Chuyển mảng URL ảnh Cloudinary thành cấu trúc screenshots chuẩn
    const screenshotsArray =
      uploadedImages.length > 0
        ? uploadedImages.map((url, idx) => ({
            id: idx + 1,
            title:
              idx === 0
                ? "Ảnh Rank & Tổng Quan"
                : idx === 1
                ? "Bộ Sưu Tập Tướng & Skin"
                : `Ảnh In-Game #${idx + 1}`,
            caption: "Ảnh chụp màn hình thực tế",
            imageUrl: url,
          }))
        : [
            {
              id: 1,
              title: "Trang Cá Nhân & Rank",
              caption: `Huy hiệu Rank ${formData.rank}`,
              imageUrl: "",
            },
          ];

    const payload = {
      id: formData.id.trim().toUpperCase(),
      title: formData.title.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rank: formData.rank,
      heroCount: Number(formData.heroCount) || 0,
      skinCount: Number(formData.skinCount) || 0,
      highlightSkins: skinsArray,
      status: formData.status,
      winRate: {
        overall: formData.winRateOverall || "60.0%",
        totalMatches: Number(formData.winRateMatches) || 0,
        rankWinRate: formData.winRateOverall || "60.0%",
      },
      emblems: emblemsArray,
      description: formData.description,
      reputationScore: 100,
      securityInfo: "100% Trắng Thông Tin - Đổi Gmail ngay",
      screenshots: screenshotsArray,
      images: uploadedImages, // Lưu mảng URL Cloudinary trực tiếp
    };

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Không thể tạo tài khoản");
      }

      setSuccessMsg(
        `🎉 Tạo tài khoản #${payload.id} thành công với ${uploadedImages.length} ảnh đã lưu vào MongoDB!`
      );

      // Reset form & ảnh đã tải
      setFormData({
        ...initialForm,
        id: "",
        title: "",
      });
      setUploadedImages([]);

      // Cập nhật lại danh sách đối soát
      loadExistingAccounts();
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-600 text-white">
              ADMIN PANEL
            </span>
            <span className="text-xs text-slate-400">MLBB Account Manager</span>
          </div>
          <h1 className="text-2xl font-black uppercase text-slate-100 tracking-tight mt-1">
            Quản Trị Đăng Bán Tài Khoản
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
          <Link
            href="/api/seed"
            target="_blank"
            className="px-3.5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-gold-sm"
          >
            <Database className="w-4 h-4" />
            <span>Seed 8 Acc Mẫu</span>
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Đăng xuất quyền Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Thông báo Thành công hoặc Thất bại */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <Link href="/" className="text-xs font-bold underline hover:text-white">
            Xem trên trang chủ →
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORM NHẬP THÔNG TIN TÀI KHOẢN MỚI */}
      <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-navy-card">
        <div className="flex items-center gap-2 pb-4 mb-5 border-b border-navy-800 text-gold-400">
          <PlusCircle className="w-5 h-5" />
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-100">
            Form Thêm Tài Khoản MLBB Mới
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hàng 1: ID & Tiêu Đề */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Mã ID Tài Khoản <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="id"
                required
                placeholder="VD: MLBB-VIP-009"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-mono text-gold-400 placeholder:text-slate-600 focus:outline-none focus:border-gold-500 uppercase"
              />
              <span className="text-[11px] text-slate-400">Mã ID phải là duy nhất</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Tiêu đề rao bán <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="VD: Acc Thần Thoại Vinh Quang - Full Skin Collector Gusion & Chou"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Hàng 2: Giá Bán, Giá Gốc, Bậc Rank, Trạng Thái */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Giá bán (VNĐ) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min={0}
                placeholder="VD: 1500000"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-mono text-gold-400 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Giá gốc ban đầu (VNĐ)
              </label>
              <input
                type="number"
                name="originalPrice"
                min={0}
                placeholder="VD: 2000000"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Bậc Rank cao nhất <span className="text-red-400">*</span>
              </label>
              <select
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-semibold text-slate-200 focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="Sử Thi">Sử Thi (Epic)</option>
                <option value="Huyền Thoại">Huyền Thoại (Legend)</option>
                <option value="Thần Thoại">Thần Thoại (Mythic)</option>
                <option value="Vinh Quang Thần Thoại">Vinh Quang Thần Thoại</option>
                <option value="Chí Tôn">Chí Tôn (Immortal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Trạng thái <span className="text-red-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-semibold text-slate-200 focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="Còn hàng">Còn hàng</option>
                <option value="Đã bán">Đã bán</option>
              </select>
            </div>
          </div>

          {/* =================================================================== */}
          {/* MỤC UPLOAD ẢNH CHỤP IN-GAME LÊN CLOUDINARY                          */}
          {/* =================================================================== */}
          <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gold-400" />
                  <span>Ảnh Chụp Màn Hình Game (Rank, Tướng, Skin)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Chọn một hoặc nhiều file ảnh (.png, .jpg, .webp). Hệ thống sẽ tự động upload lên Cloudinary.
                </p>
              </div>

              {uploadedImages.length > 0 && (
                <span className="text-xs font-mono font-bold text-gold-400 bg-navy-900 px-2.5 py-1 rounded-md border border-gold-500/30">
                  {uploadedImages.length} ảnh đã sẵn sàng
                </span>
              )}
            </div>

            {/* Input chọn nhiều file ảnh */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={isUploading}
                onChange={handleImageUpload}
                id="screenshot-files"
                className="hidden"
              />
              <label
                htmlFor="screenshot-files"
                className={`w-full py-6 px-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  isUploading
                    ? "border-gold-500/40 bg-navy-900/40 opacity-70 cursor-wait"
                    : "border-navy-700 hover:border-gold-400 bg-navy-900/60 hover:bg-navy-900"
                }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-8 h-8 text-gold-400 animate-spin" />
                    <span className="text-xs font-bold text-gold-300">
                      Đang upload ảnh lên Cloudinary... Vui lòng đợi
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-gold-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Bấm vào đây để chọn nhiều file ảnh từ máy tính
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Hỗ trợ tải lên cùng lúc nhiều ảnh chụp màn hình
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Xem trước (Preview) danh sách ảnh đã upload */}
            {uploadedImages.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                  Danh sách ảnh sẽ lưu vào tài khoản:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {uploadedImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video rounded-xl overflow-hidden bg-navy-900 border border-navy-700 hover:border-gold-400 transition-all shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-gold-400">
                        #{idx + 1}
                      </div>

                      {/* Nút xóa ảnh khỏi danh sách */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 hover:bg-red-500 text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                        title="Xóa ảnh này"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hàng 3: Số Tướng, Số Skin, Winrate, Số trận */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Số lượng tướng
              </label>
              <input
                type="number"
                name="heroCount"
                min={0}
                value={formData.heroCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-mono text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Số lượng skin
              </label>
              <input
                type="number"
                name="skinCount"
                min={0}
                value={formData.skinCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-mono text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Tỉ lệ thắng (Winrate)
              </label>
              <input
                type="text"
                name="winRateOverall"
                placeholder="VD: 72.5%"
                value={formData.winRateOverall}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Tổng số trận đấu
              </label>
              <input
                type="number"
                name="winRateMatches"
                min={0}
                value={formData.winRateMatches}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm font-mono text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Hàng 4: Danh Sách Skin Hiếm */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Danh sách Skin hiếm (Phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              name="highlightSkins"
              placeholder="VD: Granger - Starfall Knight (Legend), Ling - Serene Plume (Collector), Chou - Iori Yagami (KOF)"
              value={formData.highlightSkins}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Hàng 5: Bảng Ngọc & Mô tả */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Bảng ngọc đã nâng (Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="emblems"
                placeholder="VD: Sát Thủ Lv.60, Đấu Sĩ Lv.60, Xạ Thủ Lv.55"
                value={formData.emblems}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Mô tả tài khoản
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Nút Submit POST */}
          <div className="pt-3 border-t border-navy-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(initialForm);
                setUploadedImages([]);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-slate-400 hover:text-white bg-navy-850 hover:bg-navy-800 transition-colors"
            >
              Làm mới form
            </button>

            <button
              type="submit"
              disabled={submitting || isUploading}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-navy-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 shadow-gold-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu vào MongoDB...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>LƯU TÀI KHOẢN KÈM {uploadedImages.length} ẢNH</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH TÀI KHOẢN HIỆN CÓ ĐỂ ADMIN QUẢN LÝ NHANH */}
      <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 shadow-navy-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <div className="flex items-center gap-2 text-slate-200">
            <List className="w-5 h-5 text-gold-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Tài Khoản Hiện Có Trong Database ({existingAccounts.length})
            </h3>
          </div>

          <button
            onClick={loadExistingAccounts}
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} />
            <span>Làm mới danh sách</span>
          </button>
        </div>

        {loadingList ? (
          <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
            <span>Đang tải danh sách từ MongoDB...</span>
          </div>
        ) : existingAccounts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Chưa có tài khoản nào trong database. Hãy dùng form phía trên để thêm mới!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase font-bold border-b border-navy-800">
                <tr>
                  <th className="py-3 px-3">Mã ID</th>
                  <th className="py-3 px-3">Ảnh</th>
                  <th className="py-3 px-3">Tiêu đề</th>
                  <th className="py-3 px-3">Giá bán</th>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Tướng / Skin</th>
                  <th className="py-3 px-3">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {existingAccounts.map((acc: any) => {
                  const firstImg =
                    acc.images?.[0] || acc.screenshots?.[0]?.imageUrl || "";

                  return (
                    <tr key={acc.id} className="hover:bg-navy-850/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gold-400">
                        #{acc.id}
                      </td>
                      <td className="py-3 px-3">
                        {firstImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={firstImg}
                            alt={acc.id}
                            className="w-10 h-7 object-cover rounded border border-navy-700"
                          />
                        ) : (
                          <div className="w-10 h-7 rounded bg-navy-950 border border-navy-700 flex items-center justify-center text-[9px] text-slate-500">
                            HUD
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-200 max-w-xs truncate font-medium">
                        {acc.title}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-100">
                        {new Intl.NumberFormat("vi-VN").format(acc.price)} ₫
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950 border border-navy-700 text-slate-300">
                          {acc.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {acc.heroCount} / {acc.skinCount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.status === "Còn hàng"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-red-500/20 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {acc.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/acc/${acc.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 underline font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
