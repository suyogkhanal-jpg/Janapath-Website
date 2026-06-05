"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, Pin } from "lucide-react";

function NoticeSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse p-5 rounded-xl bg-brand-100 dark:bg-brand-900 h-24" />
      ))}
    </div>
  );
}

const categoryColors = {
  Holiday: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  Exam: "bg-accent-50 text-accent-800 border border-accent-200 dark:bg-accent-900/20 dark:text-accent-300 dark:border-accent-800",
  Event: "bg-brand-50 text-brand-800 border border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700",
  Admission: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
  General: "bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700",
};

export default function NoticesPreview({ limit = 3 }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/notices?limit=${limit}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setNotices(res.data);
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="section-label">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="section-label-text">Updates</span>
            </div>
            <h2 className="section-title">
              Latest Notices
            </h2>
          </div>
          <Link
            href="/notices"
            className="hidden sm:inline-flex items-center gap-1 text-brand-700 dark:text-brand-300 font-semibold hover:text-accent-600 hover:gap-2 transition-all text-sm"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <NoticeSkeleton />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <article
                key={notice._id}
                className="card-hover p-5 sm:p-6 group"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[notice.category] || categoryColors.General}`}>
                    {notice.category}
                  </span>
                  {notice.isPinned && <Pin className="h-3.5 w-3.5 text-accent-600" />}
                </div>
                <h3 className="font-semibold text-brand-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors text-sm sm:text-base">
                  {notice.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>
                <p className="mt-3 text-xs text-brand-400">
                  {new Date(notice.publishedAt).toLocaleDateString("en-NP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}

        <Link
          href="/notices"
          className="sm:hidden mt-6 inline-flex items-center gap-1 text-brand-700 font-semibold text-sm"
        >
          View All Notices <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
