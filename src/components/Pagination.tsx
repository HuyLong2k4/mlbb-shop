"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  limit?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  limit = 12,
  hasPrevPage,
  hasNextPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = hasPrevPage ?? currentPage > 1;
  const canGoNext = hasNextPage ?? currentPage < totalPages;

  // Thuật toán hiển thị các trang gọn gàng (có dấu ...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Thông tin số lượng hiển thị */}
      {typeof totalItems === "number" && (
        <div className="text-xs text-slate-400">
          Hiển thị{" "}
          <strong className="text-gold-400 font-mono">
            {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, totalItems)}
          </strong>{" "}
          trong tổng số{" "}
          <strong className="text-gold-400 font-mono">{totalItems}</strong> tài khoản
        </div>
      )}

      {/* Cụm nút điều khiển phân trang */}
      <div className="flex items-center gap-1.5">
        {/* Nút về Trang Đầu */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          className="p-2 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang đầu"
          aria-label="Trang đầu"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Nút Trang Trước */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className="px-3 py-2 rounded-lg bg-navy-900 border border-navy-700 text-xs font-bold text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {/* Danh sách các số trang */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`dots-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-slate-500 select-none font-mono"
              >
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                isActive
                  ? "bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 text-navy-950 shadow-gold-sm scale-105"
                  : "bg-navy-900 border border-navy-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/40"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Nút Trang Sau */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="px-3 py-2 rounded-lg bg-navy-900 border border-navy-700 text-xs font-bold text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          aria-label="Trang sau"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Nút đến Trang Cuối */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="p-2 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Trang cuối"
          aria-label="Trang cuối"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
