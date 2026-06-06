import Link from "next/link";
import {
  classesOffered,
  computerEngineering,
  curriculumOverview,
  schoolInfo,
} from "@/lib/data";
import { BookOpen, Cpu, CheckCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Academics",
  description: `Academic programs at ${schoolInfo.name} including Computer Engineering technical stream.`,
};

export default function AcademicsPage() {
  return (
    <div className="pb-16 sm:pb-20">
      <section className="page-header">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Academics</h1>
          <p className="page-header-subtitle">
            Comprehensive education from early childhood to secondary level, with a specialized Computer Engineering technical stream.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-brand-700" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-900 dark:text-white">Classes Offered</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classesOffered.map((cls) => (
              <div
                key={cls.grade}
                className="card-hover p-5 sm:p-6"
              >
                <h3 className="font-display font-semibold text-base sm:text-lg text-brand-800 dark:text-brand-300 mb-3">
                  {cls.grade}
                </h3>
                <ul className="space-y-1">
                  {cls.levels.map((l) => (
                    <li key={l} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="computer-engineering" className="scroll-mt-24">
          <div className="rounded-3xl overflow-hidden border border-brand-200 dark:border-brand-800 shadow-brand-lg">
            <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 p-6 sm:p-8 lg:p-12 text-white border-b-4 border-accent-600">
              <Cpu className="h-10 w-10 sm:h-12 sm:w-12 mb-4 text-accent-300" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{computerEngineering.title}</h2>
              <p className="text-brand-100 max-w-3xl leading-relaxed text-sm sm:text-base">{computerEngineering.description}</p>
              <p className="mt-4 text-sm font-medium text-brand-200">Duration: {computerEngineering.duration}</p>
            </div>
            <div className="p-6 sm:p-8 lg:p-12 bg-white dark:bg-brand-950/30 grid lg:grid-cols-2 gap-8 lg:gap-10">
              <div>
                <h3 className="font-display font-semibold text-xl mb-4 text-gray-900 dark:text-white">Subjects</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {computerEngineering.subjects.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl mb-4 text-gray-900 dark:text-white">Learning Outcomes</h3>
                <ul className="space-y-2">
                  {computerEngineering.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-accent-600 mt-0.5 shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
                <h3 className="font-display font-semibold text-lg mt-6 mb-3 text-gray-900 dark:text-white">Labs</h3>
                <div className="flex flex-wrap gap-2">
                  {computerEngineering.labs.map((lab) => (
                    <span key={lab} className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-medium">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="btn-accent px-8"
            >
              Apply for Computer Engineering <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-brand-900 dark:text-white">Curriculum Overview</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {curriculumOverview.map((block) => (
              <div
                key={block.title}
                className="p-6 rounded-2xl glass shadow-sm"
              >
                <h3 className="font-display font-semibold text-lg mb-4 text-gray-900 dark:text-white">{block.title}</h3>
                <ul className="space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="text-sm text-gray-600 dark:text-gray-400">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
