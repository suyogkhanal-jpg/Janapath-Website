import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import NoticesPreview from "@/components/NoticesPreview";
import PrincipalMessage from "@/components/PrincipalMessage";
import GalleryPreview from "@/components/GalleryPreview";
import CTA from "@/components/CTA";
import { facilities } from "@/lib/data";
import { CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />

      <section className="py-16 border-y border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Our Facilities
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {facilities.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-sm font-medium border border-brand-200 dark:border-brand-800"
              >
                <CheckCircle className="h-4 w-4" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <NoticesPreview />
      <PrincipalMessage />
      <GalleryPreview />
      <CTA />
    </>
  );
}
