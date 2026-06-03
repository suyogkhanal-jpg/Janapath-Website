"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Pin, Search } from "lucide-react";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;

const categoryColors = {
  Holiday: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Exam: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Event: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Admission: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  General: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
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
    <div className="pt-8 pb-20">
      <section className="bg-gradient-to-br from-brand-700 to-accent-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-10 w-10" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold">Notices & News</h1>
          </div>
          <p className="text-brand-100 text-lg">Stay updated with the latest announcements from Janapath Secondary School.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-700"
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
              <div key={i} className="animate-pulse h-32 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No notices found.</div>
        ) : (
          <>
            <div className="space-y-4">
              {paginated.map((notice) => (
                <article
                  key={notice._id}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[notice.category] || categoryColors.General}`}>
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 text-xs text-brand-600 font-medium">
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
                  <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
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
