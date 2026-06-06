"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import { SiteContentProvider } from "@/components/SiteContentProvider";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <SiteContentProvider>
      <AnnouncementTicker />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SiteContentProvider>
  );
}
