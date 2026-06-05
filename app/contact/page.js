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
    <div className="pb-16 sm:pb-20">
      <section className="page-header">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Contact Us</h1>
          <p className="page-header-subtitle">Get in touch with Janapath Secondary School.</p>
        </div>
      </section>

      <TeacherSupport />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="card p-5 sm:p-6">
              <h2 className="font-display text-lg sm:text-xl font-bold mb-5 sm:mb-6 text-brand-900 dark:text-white">School Information</h2>
              <ul className="space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: schoolInfo.location },
                  { icon: Mail, label: "Email", value: schoolInfo.email },
                  { icon: Phone, label: "Phone", value: schoolInfo.phone },
                  { icon: Clock, label: "Hours", value: schoolInfo.hours },
                ].map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-accent-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">{label}</p>
                      <p className="text-brand-900 dark:text-brand-100 text-sm sm:text-base">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden card">
              <iframe
                title="Janapath Secondary School Location"
                src={mapEmbed}
                className="w-full h-64 lg:h-80 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="p-4 bg-brand-50 dark:bg-brand-900/50 border-t border-brand-100 dark:border-brand-800 text-center">
                <a
                  href={mapDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-700 font-semibold hover:text-accent-600 transition-colors text-sm sm:text-base"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps &amp; get directions
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5 h-fit shadow-card">
            <h2 className="font-display text-lg sm:text-xl font-bold text-brand-900 dark:text-white">Send a Message</h2>

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
                <label className="block text-sm font-medium mb-1.5 text-brand-800 dark:text-brand-200">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-brand-800 dark:text-brand-200">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-brand-800 dark:text-brand-200">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-brand-800 dark:text-brand-200">Subject *</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-brand-800 dark:text-brand-200">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="input-field resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
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
