"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone, Search } from "lucide-react";
import { teachers, whatsappUrl } from "@/lib/teachers";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 12;

export default function TeacherSupport() {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");
  const [page, setPage] = useState(1);

  const groups = useMemo(
    () => ["All", ...new Set(teachers.map((t) => t.group))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return teachers.filter((t) => {
      const matchGroup = group === "All" || t.group === group;
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.designation.toLowerCase().includes(q) ||
        t.phone.includes(q);
      return matchGroup && matchSearch;
    });
  }, [search, group]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [group]);

  return (
    <section className="section-alt border-y border-brand-100 dark:border-brand-800">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="section-title mb-2">
            Contact Teachers
          </h2>
          <p className="section-desc">
            Reach out to our teachers and staff directly for academic support. Tap WhatsApp to start a chat.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-400" />
            <input
              type="search"
              placeholder="Search by name, role, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGroup(g);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  group === g
                    ? "bg-brand-700 text-white shadow-brand"
                    : "bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 text-brand-800 dark:text-brand-200 hover:border-brand-400"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginated.map((teacher) => (
            <div
              key={`${teacher.name}-${teacher.phone}`}
              className="card-hover p-4 sm:p-5"
            >
              <p className="font-semibold text-brand-900 dark:text-white text-sm sm:text-base">{teacher.name}</p>
              <p className="text-sm text-brand-700 dark:text-brand-300 mt-0.5 font-medium">{teacher.designation}</p>
              <p className="text-xs text-brand-400 mt-1">{teacher.group}</p>
              <a
                href={`tel:${teacher.phone}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-brand-700 dark:text-brand-300 hover:text-accent-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {teacher.phone}
              </a>
              <a
                href={whatsappUrl(teacher.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 sm:mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20bd5a] transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-brand-400 py-12">No teachers match your search.</p>
        )}

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
}
