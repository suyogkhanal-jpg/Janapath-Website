import { schoolInfo } from "@/lib/data";
import { Target, Eye, History, Users } from "lucide-react";
import { getSiteContent } from "@/lib/siteStore";

export const metadata = {
  title: "About Us",
  description: `Learn about ${schoolInfo.name} — history, mission, vision, and our dedicated staff in Kalanki, Kathmandu.`,
};

export default async function AboutPage() {
  const content = await getSiteContent();
  const aboutContent = content.about;
  const staffOverview = content.staffOverview;

  return (
    <div className="pb-16 sm:pb-20">
      <section className="page-header">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">About Us</h1>
          <p className="page-header-subtitle">{aboutContent.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        <section className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div className="card p-6 sm:p-8">
            <History className="h-8 w-8 text-brand-700 mb-4" />
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 text-brand-900 dark:text-white">Our History</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{aboutContent.history}</p>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 border-l-4 border-l-brand-700">
              <Target className="h-8 w-8 text-brand-700 mb-4" />
              <h2 className="font-display text-lg sm:text-xl font-bold mb-3 text-brand-900 dark:text-white">Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{aboutContent.mission}</p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800 border-l-4 border-l-accent-600">
              <Eye className="h-8 w-8 text-accent-600 mb-4" />
              <h2 className="font-display text-lg sm:text-xl font-bold mb-3 text-brand-900 dark:text-white">Vision</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{aboutContent.vision}</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Users className="h-7 w-7 sm:h-8 sm:w-8 text-brand-700" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-900 dark:text-white">Staff Overview</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {staffOverview.map((s) => (
              <div
                key={s.role}
                className="card-accent-top p-5 sm:p-6 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-brand-700 mb-1">{s.count}</p>
                <p className="text-xs sm:text-sm text-brand-600/80 dark:text-brand-300 font-medium">{s.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
