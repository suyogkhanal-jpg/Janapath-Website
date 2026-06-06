import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";
import { computerEngineering } from "@/lib/data";

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-8 sm:p-10 lg:p-16 text-white shadow-brand-lg border border-brand-600/30">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-accent-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent-600/20 border border-accent-500/30 mb-4">
              <Cpu className="h-7 w-7 text-accent-300" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              {computerEngineering.title}
            </h2>
            <p className="text-brand-100 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              {computerEngineering.description.slice(0, 180)}...
            </p>
            <Link
              href="/academics#computer-engineering"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white text-brand-800 font-semibold hover:bg-brand-50 hover:scale-[1.02] transition-all duration-200 shadow-lg text-sm sm:text-base"
            >
              Learn More <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
