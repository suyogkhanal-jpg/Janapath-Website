import { schoolInfo } from "@/lib/data";

const defaultMessages = [
  `Welcome to ${schoolInfo.name} Quality Education for a Brighter Future 
  | Admissions Open | Stay Updated with School Notices and Events 
  | Computer Engineering (Technical Stream) — Enroll now! | Thank You for Visiting Our Website |
   Stay Connected with Us | LOcated at ${schoolInfo.location}` ,
];

export default function AnnouncementTicker({ messages = defaultMessages }) {
  const doubled = [...messages, ...messages];

  return (
    <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 text-white overflow-hidden border-b-2 border-accent-600">
      <div className="flex animate-ticker whitespace-nowrap py-2 sm:py-2.5">
        {doubled.map((msg, i) => (
          <span key={i} className="mx-6 sm:mx-8 text-xs sm:text-sm font-medium tracking-wide">
            {msg} &nbsp;•&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
