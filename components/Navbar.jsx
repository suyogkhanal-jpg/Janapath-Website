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
  const [imgSrc, setImgSrc] = useState(logoUrl);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    console.log("Navbar: logoUrl ->", logoUrl);
    setImgSrc(logoUrl);
  }, [logoUrl]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled || open
          ? "bg-white/95 dark:bg-brand-950/95 backdrop-blur-md shadow-brand border-brand-100 dark:border-brand-800"
          : "bg-white/90 dark:bg-brand-950/90 backdrop-blur-sm border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:py-4 lg:px-8">
        <Link href="/" prefetch className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0">
            <Image
              src={imgSrc}
              alt={`${schoolInfo.name} logo`}
              fill
              className="object-contain"
              sizes="44px"
              priority
              onError={() => setImgSrc("/logo.png")}
            />
          </div>
          <div className="hidden min-[360px]:block min-w-0">
            <p className="font-display font-bold text-brand-900 dark:text-white leading-tight text-sm sm:text-base truncate">
              {schoolInfo.shortName}
            </p>
            <p className="text-[10px] sm:text-xs text-brand-600/70 dark:text-brand-300/70 font-medium">
              Secondary School
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-brand-700 text-white shadow-brand"
                  : "text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-brand-900 hover:text-brand-700 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/academics#computer-engineering"
            prefetch
            className="ml-2 px-5 py-2 rounded-lg bg-accent-600 text-white text-sm font-semibold shadow-accent hover:bg-accent-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
          >
            Apply Now
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t-2 border-accent-600 bg-white dark:bg-brand-950 animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={`px-4 py-3.5 rounded-xl font-medium text-base transition-colors ${
                  pathname === link.href
                    ? "bg-brand-700 text-white shadow-brand"
                    : "text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-brand-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/academics#computer-engineering"
              prefetch
              className="mt-2 px-4 py-3.5 rounded-xl bg-accent-600 text-white text-center font-semibold shadow-accent hover:bg-accent-700 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
