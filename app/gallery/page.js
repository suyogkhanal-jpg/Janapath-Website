"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, Images } from "lucide-react";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setItems(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(items.map((i) => i.category))],
    [items]
  );

  const filtered = useMemo(() => {
    return filter === "All" ? items : items.filter((i) => i.category === filter);
  }, [items, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="pb-16 sm:pb-20">
      <section className="page-header">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Images className="h-8 w-8 sm:h-10 sm:w-10 text-accent-400 shrink-0" />
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">Photo Gallery</h1>
          </div>
          <p className="page-header-subtitle">Explore life at Janapath Secondary School.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 sm:py-12">
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 sm:mb-8 scrollbar-thin">
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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-2xl bg-brand-100 dark:bg-brand-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {paginated.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setLightbox(item)}
                  className="relative aspect-square rounded-2xl overflow-hidden group ring-1 ring-brand-100 dark:ring-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="text-left">
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/70 text-xs">{item.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-4xl w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <div className="absolute bottom-6 left-0 right-0 text-center text-white">
            <p className="font-semibold text-lg">{lightbox.title}</p>
            {lightbox.description && <p className="text-white/70 text-sm mt-1">{lightbox.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
