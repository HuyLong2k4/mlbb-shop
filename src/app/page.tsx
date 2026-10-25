"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { MLBBMockAccount, MLBBAccountRank } from "@/data/mockAccounts";
import Pagination from "@/components/Pagination";

// Format tiền tệ VNĐ
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

// Cấu hình style đại diện cho từng bậc Rank MLBB (Tối giản Typography)
const getRankBadgeInfo = (rank: MLBBAccountRank) => {
  switch (rank) {
    case "Chí Tôn":
      return {
        badgeStyle: "bg-red-500/20 text-red-300 border-red-500/40",
      };
    case "Vinh Quang Thần Thoại":
      return {
        badgeStyle: "bg-amber-500/20 text-gold-300 border-gold-500/40 font-bold",
      };
    case "Thần Thoại":
      return {
        badgeStyle: "bg-amber-500/10 text-gold-400 border-gold-500/30 font-semibold",
      };
    case "Huyền Thoại":
      return {
        badgeStyle: "bg-orange-500/15 text-orange-300 border-orange-500/30",
      };
    case "Sử Thi":
    default:
      return {
        badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
  }
};

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function HomePage() {
  // State quản lý dữ liệu lấy từ API
  const [accounts, setAccounts] = useState<MLBBMockAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State Phân trang (Pagination)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // State bộ lọc giao diện
  const [selectedRank, setSelectedRank] = useState<string>("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Hàm fetch dữ liệu từ Next.js App Router API (/api/accounts?page=X&limit=12)
  const fetchAccounts = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", targetPage.toString());
      params.append("limit", "12"); // 12 tài khoản / trang
      params.append("status", "Còn hàng"); // Ẩn các acc đã bán, chỉ lấy tài khoản Còn hàng

      if (selectedRank && selectedRank !== "ALL") {
        params.append("rank", selectedRank);
      }

      const queryString = params.toString();
      const apiUrl = `/api/accounts?${queryString}`;

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Không thể tải danh sách tài khoản từ máy chủ."
        );
      }

      setAccounts(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
        setCurrentPage(result.pagination.page);
      }
    } catch (err: unknown) {
      console.error("Lỗi khi tải dữ liệu:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định khi kết nối API.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedRank]);

  // Gọi API mỗi khi Rank thay đổi (quay về trang 1)
  useEffect(() => {
    fetchAccounts(1);
  }, [fetchAccounts]);

  // Chuyển trang & Cuộn mượt mà lên đầu danh sách
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === currentPage) return;
    fetchAccounts(newPage);

    // Cuộn nhẹ lên đầu danh sách sản phẩm
    const section = document.getElementById("accounts-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Lọc thêm theo Mức giá và Từ khóa tìm kiếm trên trang hiện tại
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // Ẩn hoàn toàn các tài khoản đã bán
      if (account.status && account.status !== "Còn hàng") return false;

      // 1. Lọc theo khoảng giá
      if (selectedPriceRange !== "ALL") {
        if (selectedPriceRange === "UNDER_500K" && account.price >= 500000) return false;
        if (
          selectedPriceRange === "500K_1500K" &&
          (account.price < 500000 || account.price > 1500000)
        )
          return false;
        if (
          selectedPriceRange === "1500K_3000K" &&
          (account.price < 1500000 || account.price > 3000000)
        )
          return false;
        if (selectedPriceRange === "ABOVE_3000K" && account.price <= 3000000) return false;
      }

      // 2. Lọc theo từ khóa tìm kiếm (Mã ID, Tiêu đề hoặc Tên Skin)
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
  }, [accounts, selectedPriceRange, searchKeyword]);

  const handleResetFilter = () => {
    setSelectedRank("ALL");
    setSelectedPriceRange("ALL");
    setSearchKeyword("");
    fetchAccounts(1);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Banner eSports */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 border-b border-navy-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-navy-850 border border-gold-500/30 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
              Sàn Giao Dịch Acc MLBB Uy Tín #1 Việt Nam
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-100">
            Kho Tài Khoản <span className="text-gold-gradient">Mobile Legends</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-300 font-medium">
            100% tài khoản trắng thông tin bảo hành trọn đời.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div id="accounts-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-24">
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
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm theo Mã Acc (VD: VIP-001) hoặc tên Skin..."
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-navy-800">
            {/* Lọc theo Bậc Rank */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Bậc Rank cao nhất
              </label>
              <select
                value={selectedRank}
                onChange={(e) => {
                  setSelectedRank(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="ALL">Tất cả Rank</option>
                <option value="Chí Tôn">Chí Tôn (Immortal)</option>
                <option value="Vinh Quang Thần Thoại">Vinh Quang Thần Thoại</option>
                <option value="Thần Thoại">Thần Thoại (Mythic)</option>
                <option value="Huyền Thoại">Huyền Thoại (Legend)</option>
                <option value="Sử Thi">Sử Thi (Epic)</option>
              </select>
            </div>

            {/* Lọc theo Mức giá */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mức giá (VNĐ)
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
              >
                <option value="ALL">Tất cả mức giá</option>
                <option value="UNDER_500K">Dưới 500.000 ₫ (Sinh viên)</option>
                <option value="500K_1500K">500.000 ₫ - 1.500.000 ₫</option>
                <option value="1500K_3000K">1.500.000 ₫ - 3.000.000 ₫</option>
                <option value="ABOVE_3000K">Trên 3.000.000 ₫ (Acc VIP)</option>
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
              Tổng số: <strong className="text-gold-400 font-mono text-sm">{pagination.total}</strong> tài khoản
              {pagination.totalPages > 1 && (
                <span className="text-slate-400 ml-2">
                  (Trang {currentPage} / {pagination.totalPages})
                </span>
              )}
            </div>
            {loading && (
              <span className="text-[11px] text-gold-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Đang tải dữ liệu...
              </span>
            )}
          </div>
        </div>

        {/* 1. TRẠNG THÁI ERROR */}
        {error && (
          <div className="p-8 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-red-300 uppercase">
                Không thể tải dữ liệu tài khoản
              </h3>
              <p className="text-xs text-red-400 max-w-md mx-auto">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => fetchAccounts(currentPage)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-300 transition-colors cursor-pointer shadow-gold-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại kết nối</span>
            </button>
          </div>
        )}

        {/* 2. TRẠNG THÁI LOADING (SKELETON CARDS) */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <div
                key={item}
                className="bg-navy-900 border border-navy-800 rounded-xl sm:rounded-2xl overflow-hidden p-0 flex flex-col justify-between animate-pulse shadow-navy-card"
              >
                <div className="aspect-[16/10] w-full bg-navy-850 relative">
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 w-14 sm:w-16 h-4 sm:h-5 rounded bg-navy-800" />
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-12 sm:w-14 h-4 sm:h-5 rounded bg-navy-800" />
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-navy-800" />
                  </div>
                </div>

                <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                  <div className="h-4 bg-navy-800 rounded w-3/4" />
                  <div className="h-3 bg-navy-850 rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-2 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-navy-950 border border-navy-850">
                    <div className="h-3 bg-navy-800 rounded" />
                    <div className="h-3 bg-navy-800 rounded" />
                  </div>
                  <div className="pt-2.5 sm:pt-3 border-t border-navy-800/80 flex items-center justify-between">
                    <div className="h-4 sm:h-5 bg-navy-800 rounded w-16 sm:w-20" />
                    <div className="h-6 sm:h-7 bg-navy-800 rounded w-16 sm:w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. TRẠNG THÁI HIỂN THỊ DANH SÁCH TÀI KHOẢN (PHONG CÁCH TỐI GIẢN) */}
        {!loading && !error && filteredAccounts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filteredAccounts.map((account) => {
                const rankInfo = getRankBadgeInfo(account.rank);
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
                    {/* Banner & Badges (Tối giản hoàn toàn không icon) */}
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
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                            {account.rank}
                          </span>
                        </div>
                      )}

                      {/* ID Text Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-navy-950/90 text-gold-400 border border-gold-500/30 backdrop-blur-sm">
                          #{account.id}
                        </span>
                      </div>

                      {/* Trạng thái - Chỉ chữ, không icon */}
                      <div className="absolute top-2.5 right-2.5 z-20">
                        {isAvailable ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                            Còn hàng
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-900 text-slate-400 border border-navy-750">
                            Đã bán
                          </span>
                        )}
                      </div>

                      {/* Huy hiệu Rank - Chỉ chữ, không icon */}
                      <div className="absolute bottom-2.5 left-2.5 z-20">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${rankInfo.badgeStyle}`}>
                          {account.rank}
                        </span>
                      </div>
                    </div>

                    {/* Body: Tiêu đề & Thông số - Typography tối giản, khoảng trắng rộng rãi */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                      <div>
                        <h3
                          title={account.title}
                          className="text-xs sm:text-sm font-semibold text-slate-100 line-clamp-2 leading-relaxed group-hover:text-gold-400 transition-colors"
                        >
                          {account.title}
                        </h3>

                        {/* Bảng thông số: Tướng & Skin (Phân cấp bằng Typography đậm nhạt, không icon) */}
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

                        {/* Skin nổi bật - Không emoji icon, chỉ text tags sạch sẽ */}
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

                      {/* Footer: Giá & Nút Mua - Không icon, chỉ chữ đậm rõ ràng */}
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
                          <span
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-gold-400 to-amber-500 group-hover:from-gold-300 group-hover:to-amber-400 text-navy-950 transition-all text-center shadow-sm group-hover:scale-[1.02]"
                          >
                            Chi tiết
                          </span>
                        ) : (
                          <span
                            className="px-3.5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg bg-navy-850 text-slate-400 border border-navy-750"
                          >
                            Hết hàng
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* COMPONENT PHÂN TRANG (PAGINATION) */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              limit={pagination.limit}
              hasPrevPage={pagination.hasPrevPage}
              hasNextPage={pagination.hasNextPage}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* 4. TRẠNG THÁI EMPTY */}
        {!loading && !error && filteredAccounts.length === 0 && (
          <div className="py-16 text-center space-y-4 bg-navy-900/60 rounded-2xl border border-navy-800">
            <div className="w-14 h-14 mx-auto rounded-full bg-navy-850 border border-navy-700 flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200 uppercase">
                Chưa có tài khoản nào phù hợp
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Chưa có tài khoản nào trong database hoặc không khớp với bộ lọc hiện tại.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetFilter}
                className="px-4 py-2 text-xs font-bold uppercase rounded-lg bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
              <Link
                href="/api/seed"
                target="_blank"
                className="px-4 py-2 text-xs font-bold uppercase rounded-lg bg-navy-800 text-gold-300 border border-gold-500/30 hover:bg-navy-750 transition-colors"
              >
                Nạp 8 Acc Mẫu vào MongoDB (/api/seed)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
