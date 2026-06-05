"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Pin, Search } from "lucide-react";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;

const categoryColors = {
  Holiday: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
  Exam: "bg-accent-50 text-accent-800 border border-accent-200 dark:bg-accent-900/20 dark:text-accent-300",
  Event: "bg-brand-50 text-brand-800 border border-brand-200 dark:bg-brand-900/30 dark:text-brand-300",
  Admission: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
  General: "bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-900/30 dark:text-brand-300",
};

const categories = ["All", "General", "Holiday", "Exam", "Event", "Admission"];

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/notices?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setNotices(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return notices.filter((n) => {
      const matchCat = filter === "All" || n.category === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [notices, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <div className="pb-16 sm:pb-20">
      <section className="page-header">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-accent-400 shrink-0" />
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">Notices & News</h1>
          </div>
          <p className="page-header-subtitle">Stay updated with the latest announcements from Janapath Secondary School.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setPage(1);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  filter === cat
                    ? "bg-brand-700 text-white shadow-brand"
                    : "bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 text-brand-800 dark:text-brand-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-32 rounded-2xl bg-brand-100 dark:bg-brand-900" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-brand-400">No notices found.</div>
        ) : (
          <>
            <div className="space-y-4">
              {paginated.map((notice) => (
                <article
                  key={notice._id}
                  className="card-hover p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[notice.category] || categoryColors.General}`}>
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 text-xs text-accent-600 font-medium">
                        <Pin className="h-3 w-3" /> Pinned
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(notice.publishedAt).toLocaleDateString("en-NP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-brand-900 dark:text-white mb-2">
                    {notice.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{notice.content}</p>
                </article>
              ))}
            </div>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
