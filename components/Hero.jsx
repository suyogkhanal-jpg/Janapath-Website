"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Phone, Cpu } from "lucide-react";
import { schoolInfo } from "@/lib/data";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function Hero() {
  const { content } = useSiteContent();

  const hero = content?.hero ?? {
    backgroundImageUrl: "/images/campus.jpg",
    imageOpacity: 100,
    overlayOpacity: 55,
  };
  const stats = content?.heroStats ?? [
    { value: "1200+", label: "Students" },
    { value: "35+", label: "Teachers" },
    { value: "12+", label: "Years" },
    { value: "95%", label: "Pass Rate" },
  ];

  const imageOpacity = (hero.imageOpacity ?? 10) / 100;
  const overlayOpacity = (hero.overlayOpacity ?? 80) / 100;

  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div className="absolute inset-0" style={{ opacity: imageOpacity }}>
        <Image
          src={hero.backgroundImageUrl}
          alt="Janapath Secondary School campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/40 to-brand-800/20"
        style={{ opacity: overlayOpacity }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-brand-200 text-xs sm:text-sm font-medium text-brand-800 mb-5 sm:mb-6 shadow-sm">
            📍 {schoolInfo.location}
          </span>
          <h1 className="font-display text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] mb-4 sm:mb-6 text-white drop-shadow-sm">
            {schoolInfo.name}
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-white/95 font-medium mb-3 sm:mb-4 leading-snug">
            {schoolInfo.slogan}
          </p>
          <p className="text-brand-100 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl leading-relaxed">
            {schoolInfo.tagline}
          </p>

          <div className="flex flex-col min-[400px]:flex-row flex-wrap gap-3 sm:gap-4">
            <Link
              href="/academics#computer-engineering"
              prefetch
              className="btn-primary w-full min-[400px]:w-auto justify-center"
            >
              <Cpu className="h-5 w-5" />
              Explore Courses
            </Link>
            <Link
              href="/contact"
              prefetch
              className="btn-outline w-full min-[400px]:w-auto justify-center"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
            <Link
              href="/notices"
              prefetch
              className="btn-accent w-full min-[400px]:w-auto justify-center"
            >
              <BookOpen className="h-5 w-5" />
              Latest Notices
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/95 backdrop-blur-md border border-brand-100 border-t-[3px] border-t-accent-600 p-4 sm:p-5 text-center shadow-card"
            >
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-800">{stat.value}</p>
              <p className="text-xs sm:text-sm text-brand-600/80 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
