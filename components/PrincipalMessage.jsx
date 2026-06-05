"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";
import { principalMessage as defaultPrincipal } from "@/lib/data";

export default function PrincipalMessage() {
  const { content, loading } = useSiteContent();

  const principal = content?.principal ?? defaultPrincipal;
  const imageSrc = principal.imageUrl || principal.image || "/images/principal.png";
  const message = principal.message || defaultPrincipal.message;

  if (loading && !content) {
    return (
      <section className="section-padding bg-gradient-to-br from-brand-50 to-white dark:from-brand-950 dark:to-brand-900">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 h-64 animate-pulse bg-brand-100/50 dark:bg-brand-900/50 rounded-2xl" />
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-br from-brand-50 to-white dark:from-brand-950 dark:to-brand-900">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative aspect-[4/5] max-w-xs sm:max-w-sm mx-auto rounded-2xl overflow-hidden shadow-brand-lg bg-brand-100 dark:bg-brand-900 ring-2 ring-brand-200 dark:ring-brand-700">
              <Image
                src={imageSrc}
                alt={principal.name || "Principal"}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 80vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-display font-bold text-base sm:text-lg">{principal.name}</p>
                <p className="text-sm text-brand-100">{principal.title}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-accent-600 mb-3 sm:mb-4" />
            <h2 className="section-title mb-4 sm:mb-6">
              Message from the Principal
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">{message}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
