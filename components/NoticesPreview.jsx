"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, Pin } from "lucide-react";

function NoticeSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse p-5 rounded-xl bg-gray-200 dark:bg-gray-800 h-24" />
      ))}
    </div>
  );
}

const categoryColors = {
  Holiday: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Exam: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Event: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Admission: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  General: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
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
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
              <Bell className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Updates</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Latest Notices
            </h2>
          </div>
          <Link
            href="/notices"
            className="hidden sm:inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-semibold hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <NoticeSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {notices.map((notice) => (
              <article
                key={notice._id}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[notice.category] || categoryColors.General}`}>
                    {notice.category}
                  </span>
                  {notice.isPinned && <Pin className="h-3.5 w-3.5 text-brand-500" />}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {notice.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {notice.content}
                </p>
                <p className="mt-3 text-xs text-gray-400">
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
          className="sm:hidden mt-6 inline-flex items-center gap-1 text-brand-600 font-semibold"
        >
          View All Notices <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
