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
    <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-accent-600 text-white overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap py-2.5">
        {doubled.map((msg, i) => (
          <span key={i} className="mx-8 text-sm font-medium">
            {msg} &nbsp;•&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
