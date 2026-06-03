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
    <div className="pt-8 pb-20">
      <section className="bg-gradient-to-br from-brand-700 to-accent-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-brand-100 text-lg max-w-2xl">{aboutContent.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 space-y-16">
        <section className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <History className="h-8 w-8 text-brand-600 mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our History</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{aboutContent.history}</p>
          </div>
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
              <Target className="h-8 w-8 text-brand-600 mb-4" />
              <h2 className="font-display text-xl font-bold mb-3 text-gray-900 dark:text-white">Mission</h2>
              <p className="text-gray-600 dark:text-gray-400">{aboutContent.mission}</p>
            </div>
            <div className="p-8 rounded-2xl bg-accent-50 dark:bg-accent-950/20 border border-accent-200 dark:border-accent-800">
              <Eye className="h-8 w-8 text-accent-600 mb-4" />
              <h2 className="font-display text-xl font-bold mb-3 text-gray-900 dark:text-white">Vision</h2>
              <p className="text-gray-600 dark:text-gray-400">{aboutContent.vision}</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-brand-600" />
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Staff Overview</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffOverview.map((s) => (
              <div
                key={s.role}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-shadow"
              >
                <p className="text-3xl font-bold text-brand-600 mb-1">{s.count}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{s.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
