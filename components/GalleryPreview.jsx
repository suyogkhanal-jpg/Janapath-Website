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
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
              <Images className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Gallery</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Life at Janapath
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-1 text-brand-600 font-semibold hover:gap-2 transition-all"
          >
            View Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <div
                key={item._id}
                className={`relative overflow-hidden rounded-2xl group ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto lg:min-h-[400px]" : "aspect-square"
                }`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
