import Link from "next/link";
import { GraduationCap, MapPin, Mail, Phone, Facebook, Youtube } from "lucide-react";
import { schoolInfo, navLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-white">{schoolInfo.name}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Providing quality education and technical training in Kalanki, Kathmandu since {schoolInfo.established}.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-400 shrink-0" />
                {schoolInfo.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400 shrink-0" />
                {schoolInfo.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-400 shrink-0" />
                {schoolInfo.phone}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-brand-600 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-gray-500">{schoolInfo.hours}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {schoolInfo.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
