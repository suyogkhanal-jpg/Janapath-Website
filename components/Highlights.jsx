"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Monitor,
  Trophy,
  Users,
} from "lucide-react";
import { highlights } from "@/lib/data";

const iconMap = {
  GraduationCap,
  Monitor,
  Trophy,
  Users,
};

export default function Highlights() {
  return (
    <section className="section-padding section-alt">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="section-title mb-3 sm:mb-4">
            Why Choose Janapath?
          </h2>
          <p className="section-desc">
            A perfect blend of academic excellence and technical education in the heart of Kathmandu.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-accent-top p-5 sm:p-6 group"
              >
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brand-700 text-white mb-4 group-hover:bg-accent-600 transition-colors duration-300 shadow-brand">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-brand-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
