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
    <div className="pt-8 pb-20">
      <section className="bg-gradient-to-br from-brand-700 to-accent-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Academics</h1>
          <p className="text-brand-100 text-lg max-w-2xl">
            Comprehensive education from early childhood to secondary level, with a specialized Computer Engineering technical stream.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 space-y-20">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-8 w-8 text-brand-600" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Classes Offered</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classesOffered.map((cls) => (
              <div
                key={cls.grade}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <h3 className="font-display font-semibold text-lg text-brand-700 dark:text-brand-400 mb-3">
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
          <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-r from-brand-800 to-accent-800 p-8 lg:p-12 text-white">
              <Cpu className="h-12 w-12 mb-4" />
              <h2 className="font-display text-3xl font-bold mb-3">{computerEngineering.title}</h2>
              <p className="text-brand-100 max-w-3xl leading-relaxed">{computerEngineering.description}</p>
              <p className="mt-4 text-sm font-medium text-brand-200">Duration: {computerEngineering.duration}</p>
            </div>
            <div className="p-8 lg:p-12 bg-white dark:bg-gray-900 grid lg:grid-cols-2 gap-10">
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
                      <CheckCircle className="h-4 w-4 text-accent-500 mt-0.5 shrink-0" />
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
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Apply for Computer Engineering <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold mb-8 text-gray-900 dark:text-white">Curriculum Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
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
