"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 disabled:opacity-40 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`min-w-[2.25rem] sm:min-w-[2.5rem] px-2.5 sm:px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
            p === page
              ? "bg-brand-700 text-white shadow-brand"
              : "border border-brand-200 dark:border-brand-700 text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-brand-900"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 disabled:opacity-40 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
