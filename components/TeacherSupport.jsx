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
    <section className="bg-gray-50 dark:bg-gray-900/40 border-y border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Teachers
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Reach out to our teachers and staff directly for academic support. Tap WhatsApp to start a chat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name, role, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGroup(g);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  group === g
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((teacher) => (
            <div
              key={`${teacher.name}-${teacher.phone}`}
              className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-900 dark:text-white">{teacher.name}</p>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">{teacher.designation}</p>
              <p className="text-xs text-gray-500 mt-1">{teacher.group}</p>
              <a
                href={`tel:${teacher.phone}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600"
              >
                <Phone className="h-4 w-4" />
                {teacher.phone}
              </a>
              <a
                href={whatsappUrl(teacher.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No teachers match your search.</p>
        )}

        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  );
}
