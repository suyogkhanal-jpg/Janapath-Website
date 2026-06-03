"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { schoolInfo } from "@/lib/data";
import { useSiteContent } from "@/components/SiteContentProvider";
import { MAP_DIRECTIONS_URL, MAP_EMBED_URL } from "@/lib/teachers";
import TeacherSupport from "@/components/TeacherSupport";

export default function ContactPage() {
  const { content } = useSiteContent();
  const mapEmbed = content?.mapEmbedUrl || MAP_EMBED_URL;
  const mapDirections = content?.mapDirectionsUrl || MAP_DIRECTIONS_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: "Message sent successfully! We will get back to you soon." });
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send message." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 pb-20">
      <section className="bg-gradient-to-br from-brand-700 to-accent-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-brand-100 text-lg">Get in touch with Janapath Secondary School.</p>
        </div>
      </section>

      <TeacherSupport />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h2 className="font-display text-xl font-bold mb-6 text-gray-900 dark:text-white">School Information</h2>
              <ul className="space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: schoolInfo.location },
                  { icon: Mail, label: "Email", value: schoolInfo.email },
                  { icon: Phone, label: "Phone", value: schoolInfo.phone },
                  { icon: Clock, label: "Hours", value: schoolInfo.hours },
                ].map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
                      <p className="text-gray-800 dark:text-gray-200">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <iframe
                title="Janapath Secondary School Location"
                src={mapEmbed}
                className="w-full h-64 lg:h-80 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-center">
                <a
                  href={mapDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps &amp; get directions
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5 h-fit">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Send a Message</h2>

            {status && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${
                  status.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}
              >
                {status.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                {status.message}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Subject *</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 outline-none resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold hover:scale-[1.02] transition-transform disabled:opacity-60"
            >
              <Send className="h-5 w-5" />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
