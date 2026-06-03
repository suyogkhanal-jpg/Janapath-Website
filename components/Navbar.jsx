"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { navLinks, schoolInfo } from "@/lib/data";
import { useTheme } from "./ThemeProvider";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { content } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggle } = useTheme();

  const logoUrl = content?.logoUrl || "/logo.png";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    navLinks.forEach((link) => router.prefetch(link.href));
    router.prefetch("/academics");
  }, [router]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg shadow-lg shadow-brand-900/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" prefetch className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src={logoUrl}
              alt={`${schoolInfo.name} logo`}
              fill
              className="object-contain"
              sizes="44px"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-gray-900 dark:text-white leading-tight">
              {schoolInfo.shortName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Secondary School</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-800 hover:text-brand-700 dark:hover:text-brand-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/academics#computer-engineering"
            prefetch
            className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            Apply Now
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={`px-4 py-3 rounded-lg font-medium ${
                  pathname === link.href
                    ? "bg-brand-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/academics#computer-engineering"
              prefetch
              className="mt-2 px-4 py-3 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 text-white text-center font-semibold"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
