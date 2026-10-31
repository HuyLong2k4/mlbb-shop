"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getOptimizedImageUrl } from "@/lib/imageOptimizer";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  ImageIcon,
  X,
  Sparkles,
  Eye,
  Trash2,
} from "lucide-react";

interface AccountEditFormData {
  _id: string;
  id: string;
  title: string;
  price: number | "";
  originalPrice: number | "";
  collectionTier: string;
  heroCount: number | "";
  skinCount: number | "";
  highlightSkins: string;
  status: string;
  emblems: string;
  description: string;
}

const COLLECTION_TIERS = [
  "Sưu tập truyền kỳ",
  "Sưu tập siêu cấp",
  "Nhà đại sưu tập",
  "Sưu tập thiên hà",
  "Khác",
];

export default function EditAccountPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const accountId = params?.id as string;

  // State nạp dữ liệu ban đầu
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State biểu mẫu
  const [formData, setFormData] = useState<AccountEditFormData>({
    _id: "",
    id: "",
    title: "",
    price: "",
    originalPrice: "",
    collectionTier: "Sưu tập truyền kỳ",
    heroCount: 0,
    skinCount: 0,
    highlightSkins: "",
    status: "Còn hàng",
    emblems: "Full",
    description: "",
  });

  // Quản lý ảnh (ảnh hiện tại & ảnh mới tải lên)
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // Kiểm tra xác thực admin
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/admin/edit/${accountId}`);
    }
  }, [authStatus, router, accountId]);

  // 1. Gọi API để lấy thông tin tài khoản hiện tại và điền sẵn (pre-fill) vào form
  useEffect(() => {
    if (!accountId) return;

    const fetchAccountDetail = async () => {
      setLoadingData(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/accounts/${encodeURIComponent(accountId)}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Không tìm thấy tài khoản #${accountId} (HTTP ${res.status})`);
        }

        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json.message || "Không thể tải dữ liệu tài khoản.");
        }

        const acc = json.data;

        // Điền sẵn (pre-fill) toàn bộ thông tin cũ vào state
        setFormData({
          _id: acc._id || "",
          id: acc.id || "",
          title: acc.title || "",
          price: acc.price ?? "",
          originalPrice: acc.originalPrice ?? "",
          collectionTier: acc.collectionTier || "Sưu tập truyền kỳ",
          heroCount: acc.heroCount ?? 0,
          skinCount: acc.skinCount ?? 0,
          highlightSkins: Array.isArray(acc.highlightSkins)
            ? acc.highlightSkins.join(", ")
            : acc.highlightSkins || "",
          status: acc.status || "Còn hàng",
          emblems: acc.emblems || "Full",
          description: acc.description || "",
        });

        // Nạp danh sách ảnh đã có
        const existingImages =
          acc.images && acc.images.length > 0
            ? acc.images
            : (acc.screenshots || []).map((s: any) => s.imageUrl).filter(Boolean);

        setImages(existingImages);
      } catch (err: any) {
        console.error("Lỗi khi tải chi tiết tài khoản:", err);
        setErrorMsg(err.message || "Lỗi nạp dữ liệu tài khoản");
      } finally {
        setLoadingData(false);
      }
    };

    fetchAccountDetail();
  }, [accountId]);

  // Xử lý thay đổi input văn bản / số
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Nén ảnh client-side trước khi tải lên Cloudinary
  const compressImageIfNeeded = async (file: File): Promise<File> => {
    // Ngưỡng 300KB: Tự động nén và chuẩn hóa WebP để tiết kiệm tối đa dung lượng Cloudinary
    if (file.size <= 300 * 1024 || !file.type.startsWith("image/")) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^.]+$/, ".webp"),
                  {
                    type: "image/webp",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            "image/webp",
            0.82
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  // Tải ảnh mới lên Cloudinary
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    setUploadProgress(`Đang xử lý ${files.length} ảnh...`);

    try {
      const processedFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Đang tối ưu ảnh ${i + 1}/${files.length}...`);
        const compressed = await compressImageIfNeeded(files[i]);
        processedFiles.push(compressed);
      }

      setUploadProgress("Đang đồng bộ lên Cloudinary CDN...");
      const uploadFormData = new FormData();
      processedFiles.forEach((file) => {
        uploadFormData.append("files", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Tải ảnh lên Cloudinary thất bại.");
      }

      // Thêm ảnh mới tải lên vào danh sách
      if (Array.isArray(data.urls)) {
        setImages((prev) => [...prev, ...data.urls]);
      }
      setUploadProgress("");
    } catch (err: any) {
      console.error("Lỗi upload ảnh:", err);
      setErrorMsg(err.message || "Có lỗi xảy ra khi tải ảnh lên.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Xóa ảnh khỏi danh sách hiển thị trên form
  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. Gửi request PUT để lưu thông tin cập nhật vào MongoDB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      // Validate cơ bản
      if (!formData.title.trim()) {
        throw new Error("Vui lòng nhập tiêu đề tài khoản.");
      }
      if (formData.price === "" || Number(formData.price) < 0) {
        throw new Error("Vui lòng nhập giá bán hợp lệ.");
      }

      const payload = {
        _id: formData._id,
        title: formData.title.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice === "" ? null : Number(formData.originalPrice),
        collectionTier: formData.collectionTier,
        heroCount: Number(formData.heroCount) || 0,
        skinCount: Number(formData.skinCount) || 0,
        highlightSkins: formData.highlightSkins,
        status: formData.status,
        emblems: formData.emblems,
        description: formData.description.trim(),
        images: images,
      };

      const res = await fetch(`/api/accounts/${encodeURIComponent(formData.id || accountId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Lỗi khi lưu dữ liệu cập nhật.");
      }

      setSuccessMsg(`Cập nhật thành công tài khoản #${formData.id}! Dữ liệu trang chủ và chi tiết đã được làm mới tức thì.`);
      router.refresh();

      // Tự động cuộn lên đầu để xem thông báo
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Lỗi khi lưu tài khoản:", err);
      setErrorMsg(err.message || "Đã xảy ra lỗi khi lưu thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-gold-400 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-slate-300">
          Đang tải thông tin tài khoản #{accountId}...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header điều hướng */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-navy-900 border border-navy-800 hover:border-gold-500/40 text-slate-400 hover:text-gold-300 transition-colors"
            title="Quay lại Admin Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              Chỉnh Sửa Tài Khoản
              <span className="font-mono text-gold-400 font-bold">#{formData.id}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              MongoDB _id: <code className="text-slate-300 font-mono text-[11px]">{formData._id}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/acc/${formData.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-900 hover:bg-navy-850 text-slate-300 border border-navy-750 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            <span>Xem trang khách</span>
          </Link>
        </div>
      </div>

      {/* Thông báo trạng thái */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-400">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{successMsg}</div>
          </div>
          <div className="flex items-center gap-2 pl-8 sm:pl-0">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-navy-950 hover:bg-emerald-400 transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              Xem Trang chủ →
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-950 text-slate-300 border border-navy-750 hover:text-white transition-colors"
            >
              Về Admin
            </Link>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Form chỉnh sửa chính */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 sm:p-7 space-y-6 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2 border-b border-navy-800 pb-3">
            <Sparkles className="w-4 h-4" />
            Thông Tin Chi Tiết
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Mã tài khoản (Chỉ đọc) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Mã tài khoản (ID)
              </label>
              <input
                type="text"
                name="id"
                disabled
                value={formData.id}
                className="w-full bg-navy-950 border border-navy-800 rounded-lg px-3.5 py-2.5 text-sm font-mono text-gold-400 font-bold opacity-75 cursor-not-allowed"
              />
            </div>

            {/* Tiêu đề */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tiêu đề rao bán <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ví dụ: Acc Cực Phẩm Gusion Vũ Trụ + Chou KOF"
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>

            {/* Giá bán thực tế */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Giá bán thực tế (VNĐ) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min={0}
                value={formData.price}
                onChange={handleChange}
                placeholder="Ví dụ: 1500000"
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>

            {/* Giá niêm yết gốc */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Giá niêm yết ban đầu (Gốc)
              </label>
              <input
                type="number"
                name="originalPrice"
                min={0}
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Ví dụ: 2500000 (Để trống nếu không giảm giá)"
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>

            {/* Điểm Sưu Tập */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bậc Điểm Sưu Tập
              </label>
              <select
                name="collectionTier"
                value={formData.collectionTier}
                onChange={handleChange}
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors cursor-pointer"
              >
                {COLLECTION_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái tài khoản */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trạng thái kho hàng
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors cursor-pointer"
              >
                <option value="Còn hàng">🟢 Còn hàng (Đang bán)</option>
                <option value="Đã bán">🔴 Đã bán (Hết hàng)</option>
              </select>
            </div>

            {/* Số Tướng */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Số lượng Tướng
              </label>
              <input
                type="number"
                name="heroCount"
                min={0}
                value={formData.heroCount}
                onChange={handleChange}
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-100 outline-none transition-colors"
              />
            </div>

            {/* Số Skin */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Số lượng Skin (Trang phục)
              </label>
              <input
                type="number"
                name="skinCount"
                min={0}
                value={formData.skinCount}
                onChange={handleChange}
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-100 outline-none transition-colors"
              />
            </div>

            {/* Bảng ngọc */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bảng ngọc
              </label>
              <select
                name="emblems"
                value={formData.emblems}
                onChange={handleChange}
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors cursor-pointer"
              >
                <option value="Full">Full (Tất cả cấp 60)</option>
                <option value="Gần Full">Gần Full</option>
              </select>
            </div>

            {/* Danh sách skin nổi bật */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Trang phục nổi bật (Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                name="highlightSkins"
                value={formData.highlightSkins}
                onChange={handleChange}
                placeholder="Gusion - Vũ Trụ, Chou - Iori Yagami, Fanny - Nhẹ Tựa Lông Hồng"
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors"
              />
            </div>

            {/* Mô tả chi tiết */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mô tả chi tiết tài khoản
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Thông tin bảo hành, tình trạng liên kết, ưu đãi tặng kèm..."
                className="w-full bg-navy-950 border border-navy-750 focus:border-gold-500 rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Khối quản lý ảnh Cloudinary */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-2xl p-5 sm:p-7 space-y-5 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Quản Lý Hình Ảnh In-Game ({images.length} ảnh)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Xóa ảnh không cần thiết và up ảnh mới. Khi ấn Lưu, hệ thống sẽ tự động dọn dẹp các file ảnh cũ trên Cloudinary.
              </p>
            </div>

            {/* Nút Upload ảnh mới */}
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-gold-400 border border-gold-500/30 transition-all cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              <span>Tải thêm ảnh</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadImages}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Tiến trình Upload */}
          {isUploading && (
            <div className="p-3 rounded-lg bg-navy-950 border border-gold-500/30 flex items-center gap-3 text-gold-300 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
              <span>{uploadProgress || "Đang xử lý tải ảnh lên..."}</span>
            </div>
          )}

          {/* Lưới hiển thị danh sách ảnh */}
          {images.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-navy-800 rounded-xl text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Chưa có ảnh nào cho tài khoản này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-[16/10] bg-navy-950 rounded-lg overflow-hidden border border-navy-800 hover:border-gold-500/50 transition-all"
                >
                  <Image
                    src={getOptimizedImageUrl(imgUrl, { width: 300 })}
                    alt={`Ảnh #${idx + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />

                  {/* Badge số thứ tự (Ảnh 1 là ảnh bìa chính) */}
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        idx === 0
                          ? "bg-gold-500 text-navy-950"
                          : "bg-navy-950/80 text-slate-300 backdrop-blur-sm"
                      }`}
                    >
                      {idx === 0 ? "Ảnh bìa" : `#${idx + 1}`}
                    </span>
                  </div>

                  {/* Nút xóa ảnh */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Xóa ảnh này"
                    className="absolute top-1.5 right-1.5 z-10 p-1 rounded-md bg-red-600/90 text-white hover:bg-red-500 transition-colors shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nút Submit Lưu thay đổi */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={submitting || isUploading}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 hover:brightness-110 active:scale-[0.98] transition-all shadow-gold-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
