import Link from "next/link";
import { Cpu, ArrowRight } from "lucide-react";
import { computerEngineering } from "@/lib/data";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 p-10 lg:p-16 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative max-w-2xl">
            <Cpu className="h-12 w-12 mb-4 opacity-90" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              {computerEngineering.title}
            </h2>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed">
              {computerEngineering.description.slice(0, 180)}...
            </p>
            <Link
              href="/academics#computer-engineering"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-800 font-semibold hover:scale-105 transition-transform shadow-xl"
            >
              Learn More <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
