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
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-accent-900 text-gray-900">
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
        className="absolute inset-0 bg-gradient-to-t from-brand-950 to-transparent"
        style={{ opacity: overlayOpacity }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-300 text-sm font-medium text-gray-900 mb-6">
            📍 {schoolInfo.location}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            {schoolInfo.name}
          </h1>

          <p className="text-xl sm:text-2xl text-white font-medium mb-4">
            {schoolInfo.slogan}
          </p>
          <p className="text-blue-1500 font-serif text-lg mb-10 max-w-2xl">
            {schoolInfo.tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/academics#computer-engineering"
              prefetch
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-800 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Cpu className="h-5 w-5" />
              Explore Courses
            </Link>
            <Link
              href="/contact"
              prefetch
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-900 font-semibold hover:bg-white transition-all"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
            <Link
              href="/notices"
              prefetch
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-600 font-semibold hover:bg-accent-500 transition-all"
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
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200 p-5 text-center"
            >
              <p className="text-2xl sm:text-3xl font-bold text-black">{stat.value}</p>
              <p className="text-sm text-gray-800 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
