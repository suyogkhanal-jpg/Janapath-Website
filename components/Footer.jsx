import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, Facebook, Youtube } from "lucide-react";
import { schoolInfo, navLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100 border-t-4 border-accent-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 shrink-0">
                <Image
                  src="/logo.png"
                  alt={`${schoolInfo.name} logo`}
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <span className="font-display font-bold text-white text-base sm:text-lg leading-tight">
                {schoolInfo.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-brand-200/80 max-w-xs">
              Providing quality education and technical training in Kalanki, Kathmandu since {schoolInfo.established}.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-200 hover:text-accent-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-accent-500 shrink-0" />
                <span className="text-brand-200">{schoolInfo.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent-500 shrink-0" />
                <a href={`mailto:${schoolInfo.email}`} className="text-brand-200 hover:text-accent-400 transition-colors break-all">
                  {schoolInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent-500 shrink-0" />
                <span className="text-brand-200">{schoolInfo.phone}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex gap-3">
              <a
                href="#https://www.facebook.com/janapathsecondaryschool"
                className="p-2.5 rounded-xl bg-brand-900 border border-brand-800 hover:bg-accent-600 hover:border-accent-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-xl bg-brand-900 border border-brand-800 hover:bg-accent-600 hover:border-accent-600 transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-brand-300/70 leading-relaxed">{schoolInfo.hours}</p>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-brand-800 text-center text-xs sm:text-sm text-brand-300/60">
          © {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
