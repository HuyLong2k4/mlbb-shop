"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, RefreshCw } from "lucide-react";
import { MLBBMockAccount } from "@/data/mockAccounts";
import Pagination from "@/components/Pagination";

// Format tiền tệ VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

// Cấu hình style đại diện cho từng Cấp Điểm Sưu Tập MLBB
const getTierBadgeInfo = (tier?: string, fallbackRank?: string) => {
  const currentTier =
    tier ||
    (fallbackRank === "Chí Tôn"
      ? "Sưu tập thiên hà"
      : fallbackRank === "Vinh Quang Thần Thoại"
      ? "Nhà đại sưu tập"
      : fallbackRank === "Thần Thoại"
      ? "Sưu tập siêu cấp"
      : "Sưu tập truyền kỳ");

  switch (currentTier) {
    case "Sưu tập thiên hà":
      return {
        label: "Sưu tập thiên hà",
        badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold",
      };
    case "Nhà đại sưu tập":
      return {
        label: "Nhà đại sưu tập",
        badgeStyle: "bg-amber-500/20 text-gold-300 border-gold-500/40 font-bold",
      };
    case "Sưu tập siêu cấp":
      return {
        label: "Sưu tập siêu cấp",
        badgeStyle: "bg-red-500/20 text-red-300 border-red-500/40 font-semibold",
      };
    case "Sưu tập truyền kỳ":
      return {
        label: "Sưu tập truyền kỳ",
        badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
    case "Khác":
    default:
      return {
        label: currentTier || "Khác",
        badgeStyle: "bg-slate-500/20 text-slate-300 border-slate-500/30 font-medium",
      };
  }
};

interface AccountListClientProps {
  initialAccounts: MLBBMockAccount[];
}

export default function AccountListClient({ initialAccounts }: AccountListClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State quản lý bộ lọc
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Lọc danh sách theo Điểm sưu tập, Mức giá và Từ khóa
  const filteredAccounts = useMemo(() => {
    return initialAccounts.filter((account) => {
      // Ẩn tài khoản đã bán
      if (account.status && account.status !== "Còn hàng") return false;

      // 1. Lọc theo Điểm Sưu Tập (kèm fallback rank nếu nick cũ chưa có tier)
      if (selectedTier !== "ALL") {
        const computedTier =
          account.collectionTier ||
          (account.rank === "Chí Tôn"
            ? "Sưu tập thiên hà"
            : account.rank === "Vinh Quang Thần Thoại"
            ? "Nhà đại sưu tập"
            : account.rank === "Thần Thoại"
            ? "Sưu tập siêu cấp"
            : "Sưu tập truyền kỳ");

        if (computedTier !== selectedTier) return false;
      }

      // 2. Lọc theo khoảng giá (VIP: >= 1tr, Sinh Viên: < 1tr)
      if (selectedPriceRange !== "ALL") {
        if (selectedPriceRange === "STUDENT_UNDER_1M" && account.price >= 1000000) return false;
        if (selectedPriceRange === "VIP_ABOVE_1M" && account.price < 1000000) return false;
        if (selectedPriceRange === "UNDER_500K" && account.price >= 500000) return false;
        if (
          selectedPriceRange === "500K_1M" &&
          (account.price < 500000 || account.price >= 1000000)
        )
          return false;
        if (
          selectedPriceRange === "1M_3M" &&
          (account.price < 1000000 || account.price > 3000000)
        )
          return false;
        if (selectedPriceRange === "ABOVE_3M" && account.price <= 3000000) return false;
      }

      // 3. Lọc theo từ khóa tìm kiếm (Mã ID, Tiêu đề hoặc Tên Skin)
      if (searchKeyword.trim() !== "") {
        const query = searchKeyword.toLowerCase();
        const matchId = account.id?.toLowerCase().includes(query);
        const matchTitle = account.title?.toLowerCase().includes(query);
        const matchSkin = account.highlightSkins?.some((skin) =>
          skin.toLowerCase().includes(query)
        );
        return matchId || matchTitle || matchSkin;
      }

      return true;
    });
  }, [initialAccounts, selectedTier, selectedPriceRange, searchKeyword]);

  // Phân trang dữ liệu
  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;
  const currentSlice = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  const handleResetFilter = () => {
    setSelectedTier("ALL");
    setSelectedPriceRange("ALL");
    setSearchKeyword("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const section = document.getElementById("accounts-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* THANH BỘ LỌC (FILTER TOOLBAR) */}
      <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-4 sm:p-6 shadow-navy-card backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-black uppercase tracking-wider text-slate-100">
              Bộ Lọc Tìm Kiếm
            </span>
          </div>

          {/* Ô tìm kiếm từ khóa / Mã ID */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Mã Acc (VD: VIP-001) hoặc tên Skin..."
              className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
            {searchKeyword && (
              <button
                onClick={() => {
                  setSearchKeyword("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-navy-800">
          {/* Lọc theo Điểm Sưu Tập */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Điểm Sưu Tập
            </label>
            <select
              value={selectedTier}
              onChange={(e) => {
                setSelectedTier(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Tất cả Điểm Sưu Tập</option>
              <option value="Sưu tập thiên hà">Sưu tập thiên hà</option>
              <option value="Nhà đại sưu tập">Nhà đại sưu tập</option>
              <option value="Sưu tập siêu cấp">Sưu tập siêu cấp</option>
              <option value="Sưu tập truyền kỳ">Sưu tập truyền kỳ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Lọc theo Mức giá */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Mức giá (VNĐ)
            </label>
            <select
              value={selectedPriceRange}
              onChange={(e) => {
                setSelectedPriceRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Tất cả mức giá</option>
              <option value="VIP_ABOVE_1M">Từ 1.000.000 ₫ trở lên (Acc VIP)</option>
              <option value="STUDENT_UNDER_1M">Dưới 1.000.000 ₫ (Acc Sinh Viên)</option>
              <option value="UNDER_500K">Dưới 500.000 ₫ (Giá rẻ)</option>
              <option value="500K_1M">500.000 ₫ - 1.000.000 ₫</option>
              <option value="1M_3M">1.000.000 ₫ - 3.000.000 ₫ (VIP)</option>
              <option value="ABOVE_3M">Trên 3.000.000 ₫ (Siêu VIP)</option>
            </select>
          </div>

          {/* Nút Đặt lại bộ lọc */}
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <button
              type="button"
              onClick={handleResetFilter}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-navy-850 hover:bg-navy-800 border border-navy-700 hover:border-gold-500/50 transition-all flex items-center justify-center cursor-pointer"
            >
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <div>
            Tổng số: <strong className="text-gold-400 font-mono text-sm">{filteredAccounts.length}</strong> tài khoản
            {totalPages > 1 && (
              <span className="text-slate-400 ml-2">
                (Trang {currentPage} / {totalPages})
              </span>
            )}
          </div>

          <button
            onClick={handleRefresh}
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* DANH SÁCH THẺ TÀI KHOẢN */}
      {currentSlice.length === 0 ? (
        <div className="p-12 rounded-2xl bg-navy-900 border border-navy-800 text-center space-y-3">
          <p className="text-sm font-bold uppercase text-slate-300">
            Không tìm thấy tài khoản phù hợp
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Vui lòng thử điều chỉnh lại bộ lọc Điểm Sưu Tập, khoảng giá hoặc xóa từ khóa tìm kiếm.
          </p>
          <button
            type="button"
            onClick={handleResetFilter}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {currentSlice.map((account) => {
            const tierInfo = getTierBadgeInfo(account.collectionTier, account.rank);
            const isAvailable = account.status === "Còn hàng";
            const displayImg =
              (account as any).images?.[0] ||
              account.screenshots?.[0]?.imageUrl ||
              "";

            return (
              <Link
                key={account.id}
                href={`/acc/${account.id}`}
                className={`group relative bg-navy-900 border rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-sm cursor-pointer ${
                  isAvailable
                    ? "border-navy-800 hover:border-gold-500/50 hover:shadow-gold-md hover:-translate-y-1"
                    : "border-navy-850 opacity-60 grayscale-[50%]"
                }`}
              >
                {/* Banner & Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-950/80 z-10 pointer-events-none" />

                  {displayImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={displayImg}
                      alt={account.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy-950 p-4">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center">
                        {tierInfo.label}
                      </span>
                    </div>
                  )}

                  {/* ID Text Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-navy-950/90 text-gold-400 border border-gold-500/30 backdrop-blur-sm">
                      #{account.id}
                    </span>
                  </div>

                  {/* Trạng thái & Phân loại VIP / Sinh Viên */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        account.price >= 1000000
                          ? "bg-amber-500/20 text-gold-300 border-gold-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {account.price >= 1000000 ? "VIP" : "Sinh Viên"}
                    </span>
                    {isAvailable ? (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                        Còn hàng
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-navy-900 text-slate-400 border border-navy-750">
                        Đã bán
                      </span>
                    )}
                  </div>

                  {/* Huy hiệu Điểm Sưu Tập */}
                  <div className="absolute bottom-2.5 left-2.5 z-20">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${tierInfo.badgeStyle}`}>
                      {tierInfo.label}
                    </span>
                  </div>
                </div>

                {/* Body: Tiêu đề & Thông số */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    <h3
                      title={account.title}
                      className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2 leading-relaxed group-hover:text-gold-400 transition-colors"
                    >
                      {account.title}
                    </h3>

                    {/* Bảng thông số: Tướng & Trang phục */}
                    <div className="grid grid-cols-2 gap-3 mt-3.5 py-2.5 px-3 rounded-xl bg-navy-950/70 border border-navy-850">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                          Tướng
                        </span>
                        <span className="text-sm font-bold text-slate-100 font-mono mt-0.5 block">
                          {account.heroCount}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">
                          Trang phục
                        </span>
                        <span className="text-sm font-bold text-gold-400 font-mono mt-0.5 block">
                          {account.skinCount}
                        </span>
                      </div>
                    </div>

                    {/* Skin nổi bật */}
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Skin nổi bật
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {account.highlightSkins?.slice(0, 2).map((skin, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-slate-300 font-medium truncate max-w-full"
                          >
                            {skin}
                          </span>
                        ))}
                        {account.highlightSkins && account.highlightSkins.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-950 text-gold-400 font-mono font-bold border border-navy-800">
                            +{account.highlightSkins.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Giá & Nút Chi tiết */}
                  <div className="pt-3.5 border-t border-navy-850 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                        Giá bán
                      </div>
                      <div className="text-base sm:text-lg font-bold text-gold-400 font-mono tracking-tight mt-0.5">
                        {formatVND(account.price)}
                      </div>
                    </div>

                    {isAvailable ? (
                      <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-gold-400 to-amber-500 group-hover:from-gold-300 group-hover:to-amber-400 text-navy-950 transition-all text-center shadow-sm group-hover:scale-[1.02]">
                        Chi tiết
                      </span>
                    ) : (
                      <span className="px-3.5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg bg-navy-850 text-slate-400 border border-navy-750">
                        Hết hàng
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* PHÂN TRANG (PAGINATION) */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredAccounts.length}
        limit={pageSize}
      />
    </div>
  );
}
