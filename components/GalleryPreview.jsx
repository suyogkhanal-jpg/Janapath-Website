"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";

export default function GalleryPreview({ limit = 4 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setItems(res.data.slice(0, limit));
      })
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="section-label">
              <Images className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="section-label-text">Gallery</span>
            </div>
            <h2 className="section-title">
              Life at Janapath
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-1 text-brand-700 font-semibold hover:text-accent-600 hover:gap-2 transition-all text-sm"
          >
            View Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-brand-100 dark:bg-brand-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map((item, i) => (
              <div
                key={item._id}
                className={`relative overflow-hidden rounded-2xl group ring-1 ring-brand-100 dark:ring-brand-800 ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto lg:min-h-[360px]" : "aspect-square"
                }`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-brand-200 text-xs">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/gallery"
          className="sm:hidden mt-6 inline-flex items-center gap-1 text-brand-700 font-semibold text-sm"
        >
          View Gallery <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
