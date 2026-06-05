"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Bell,
  Images,
  LogOut,
  Plus,
  Trash2,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notices");
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [site, setSite] = useState(null);
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: "",
    category: "General",
    isPinned: false,
  });
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    category: "Campus",
  });
  const [galleryFile, setGalleryFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin");
      return;
    }
    loadData();
  }, [router]);

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  const loadData = async () => {
    const [nRes, gRes, sRes] = await Promise.all([
      fetch("/api/notices?limit=50"),
      fetch("/api/gallery"),
      fetch("/api/site"),
    ]);
    const nData = await nRes.json();
    const gData = await gRes.json();
    const sData = await sRes.json();
    if (nData.success) setNotices(nData.data);
    if (gData.success) setGallery(gData.data);
    if (sData.success) setSite(sData.data);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  const addNotice = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(noticeForm),
    });
    const data = await res.json();
    if (data.success) {
      setStatus("Notice added!");
      setNoticeForm({ title: "", content: "", category: "General", isPinned: false });
      loadData();
    } else {
      setStatus(data.error || "Failed");
    }
  };

  const deleteNotice = async (id) => {
    if (!confirm("Delete this notice?")) return;
    await fetch(`/api/notices?id=${id}`, { method: "DELETE", headers: authHeaders() });
    loadData();
  };

  const addGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      setStatus("Please choose an image to upload.");
      return;
    }

    const form = new FormData();
    form.append("title", galleryForm.title);
    form.append("category", galleryForm.category);
    form.append("description", galleryForm.description || "");
    form.append("image", galleryFile);

    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: authHeaders(),
      body: form,
    });
    const data = await res.json();
    if (data.success) {
      setStatus("Gallery item added!");
      setGalleryForm({ title: "", description: "", category: "Campus" });
      setGalleryFile(null);
      loadData();
    } else {
      setStatus(data.error || "Failed");
    }
  };

  const deleteGallery = async (id) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE", headers: authHeaders() });
    loadData();
  };

  const replaceGalleryImage = async (id, file) => {
    if (!file) return;
    const form = new FormData();
    form.append("id", id);
    form.append("image", file);
    const res = await fetch("/api/gallery", { method: "PUT", headers: authHeaders(), body: form });
    const data = await res.json();
    if (data.success) {
      setStatus("Image replaced!");
      loadData();
    } else {
      setStatus(data.error || "Failed");
    }
  };

  const updateSite = async (e) => {
    e.preventDefault();
    if (!site) return;

    const form = new FormData();
    form.append("sliderTexts", JSON.stringify(site.sliderTexts || []));
    form.append("staffOverview", JSON.stringify(site.staffOverview || []));
    form.append("heroStats", JSON.stringify(site.heroStats || []));
    form.append("heroImageOpacity", String(site.hero?.imageOpacity ?? 100));
    form.append("heroOverlayOpacity", String(site.hero?.overlayOpacity ?? 55));
    form.append("principalName", site.principal?.name || "");
    form.append("principalTitle", site.principal?.title || "");
    form.append("principalMessage", site.principal?.message || "");
    form.append("aboutIntro", site.about?.intro || "");
    form.append("aboutHistory", site.about?.history || "");
    form.append("aboutMission", site.about?.mission || "");
    form.append("aboutVision", site.about?.vision || "");
    form.append("mapEmbedUrl", site.mapEmbedUrl || "");
    form.append("mapDirectionsUrl", site.mapDirectionsUrl || "");
    if (site.__principalImageFile) form.append("principalImage", site.__principalImageFile);
    if (site.__logoImageFile) form.append("logoImage", site.__logoImageFile);
    if (site.__heroBackgroundFile) form.append("heroBackgroundImage", site.__heroBackgroundFile);

    const res = await fetch("/api/site", { method: "PUT", headers: authHeaders(), body: form });
    const data = await res.json();
    if (data.success) {
      setStatus("Site content saved!");
      setSite({ ...data.data });
    } else {
      setStatus(data.error || "Failed");
    }
  };

  const navItems = [
    { id: "notices", label: "Notices", icon: Bell },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "site", label: "Site Content", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-brand-600" />
            <div>
              <p className="font-display font-bold text-gray-900 dark:text-white">Janapath</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-brand-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-brand-600" />
              Admin Dashboard
            </h1>
          </div>
          <Link href="/" className="text-sm text-brand-600 hover:underline">View Site</Link>
        </header>

        <div className="p-4 lg:p-8">
          {status && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm font-medium">
              {status}
              <button onClick={() => setStatus("")} className="ml-2 opacity-60">×</button>
            </div>
          )}

          {activeTab === "notices" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-brand-600" /> Add Notice
                </h2>
                <form onSubmit={addNotice} className="grid sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Title"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {["General", "Holiday", "Exam", "Event", "Admission"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Notice content"
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    required
                    rows={3}
                    className="sm:col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={noticeForm.isPinned}
                      onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                    />
                    Pin this notice
                  </label>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">
                    Add Notice
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="font-display font-bold">All Notices ({notices.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="text-left p-4 font-semibold">Title</th>
                        <th className="text-left p-4 font-semibold">Category</th>
                        <th className="text-left p-4 font-semibold hidden md:table-cell">Content</th>
                        <th className="text-left p-4 font-semibold">Date</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notices.map((n) => (
                        <tr key={n._id} className="border-t border-gray-100 dark:border-gray-800">
                          <td className="p-4 font-medium">{n.title}</td>
                          <td className="p-4">{n.category}</td>
                          <td className="p-4 hidden md:table-cell text-gray-500 line-clamp-2 max-w-xs">{n.content}</td>
                          <td className="p-4 text-gray-500">{new Date(n.publishedAt).toLocaleDateString()}</td>
                          <td className="p-4">
                            <button onClick={() => deleteNotice(n._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-brand-600" /> Add Gallery Image
                </h2>
                <form onSubmit={addGallery} className="grid sm:grid-cols-2 gap-4">
                  <input placeholder="Title" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} required className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500" />
                  <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {["Library", "Classrooms", "Science Lab", "Computer Lab", "Campus", "Events", "Sports", "Students"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                    className="sm:col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <input placeholder="Description (optional)" value={galleryForm.description} onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} className="sm:col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500" />
                  <button type="submit" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">Add Image</button>
                </form>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => replaceGalleryImage(item._id, e.target.files?.[0] || null)}
                          />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Replace</span>
                        </label>
                        <button onClick={() => deleteGallery(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "site" && site && (
            <form onSubmit={updateSite} className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">School Logo</h2>
                <p className="text-xs text-gray-500">Upload a PNG with transparent background for best results.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSite({ ...site, __logoImageFile: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">Homepage Background Image</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSite({ ...site, __heroBackgroundFile: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image brightness ({site.hero?.imageOpacity ?? 100}%)
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={site.hero?.imageOpacity ?? 100}
                    onChange={(e) =>
                      setSite({
                        ...site,
                        hero: { ...site.hero, imageOpacity: Number(e.target.value) },
                      })
                    }
                    className="w-full mt-2"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overlay darkness ({site.hero?.overlayOpacity ?? 55}%)
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={site.hero?.overlayOpacity ?? 55}
                    onChange={(e) =>
                      setSite({
                        ...site,
                        hero: { ...site.hero, overlayOpacity: Number(e.target.value) },
                      })
                    }
                    className="w-full mt-2"
                  />
                </label>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">Homepage Statistics</h2>
                <textarea
                  value={(site.heroStats || []).map((s) => `${s.value}|${s.label}`).join("\n")}
                  onChange={(e) => {
                    const rows = e.target.value.split("\n").map((r) => r.trim()).filter(Boolean);
                    const heroStats = rows.map((r) => {
                      const [value, label] = r.split("|");
                      return { value: (value || "").trim(), label: (label || "").trim() };
                    }).filter((s) => s.value && s.label);
                    setSite({ ...site, heroStats });
                  }}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="1200+|Students (one per line)"
                />
                <p className="text-xs text-gray-500">Format: <code>Value|Label</code> (e.g. <code>500+|Students</code>)</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">Homepage Slider Text</h2>
                <textarea
                  value={(site.sliderTexts || []).join("\n")}
                  onChange={(e) => setSite({ ...site, sliderTexts: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="One line per slider text"
                />
                <p className="text-xs text-gray-500">Add one text per line. These will rotate on the homepage slider.</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">Principal Message</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    value={site.principal?.name || ""}
                    onChange={(e) => setSite({ ...site, principal: { ...site.principal, name: e.target.value } })}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Principal name"
                  />
                  <input
                    value={site.principal?.title || ""}
                    onChange={(e) => setSite({ ...site, principal: { ...site.principal, title: e.target.value } })}
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Principal title"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSite({ ...site, __principalImageFile: e.target.files?.[0] || null })}
                    className="sm:col-span-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                  <textarea
                    value={site.principal?.message || ""}
                    onChange={(e) => setSite({ ...site, principal: { ...site.principal, message: e.target.value } })}
                    rows={5}
                    className="sm:col-span-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Principal message"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">About Content</h2>
                <textarea value={site.about?.intro || ""} onChange={(e) => setSite({ ...site, about: { ...site.about, intro: e.target.value } })} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500" placeholder="Intro" />
                <textarea value={site.about?.history || ""} onChange={(e) => setSite({ ...site, about: { ...site.about, history: e.target.value } })} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500" placeholder="History" />
                <textarea value={site.about?.mission || ""} onChange={(e) => setSite({ ...site, about: { ...site.about, mission: e.target.value } })} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500" placeholder="Mission" />
                <textarea value={site.about?.vision || ""} onChange={(e) => setSite({ ...site, about: { ...site.about, vision: e.target.value } })} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500" placeholder="Vision" />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">Google Maps (Contact Page)</h2>
                <input
                  value={site.mapEmbedUrl || ""}
                  onChange={(e) => setSite({ ...site, mapEmbedUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  placeholder="Map embed iframe URL"
                />
                <input
                  value={site.mapDirectionsUrl || ""}
                  onChange={(e) => setSite({ ...site, mapDirectionsUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  placeholder="Directions link (Google Maps share URL)"
                />
                <p className="text-xs text-gray-500">Use the share link for directions; use the embed URL from Google Maps → Share → Embed a map.</p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <h2 className="font-display font-bold text-lg">Staff Counts</h2>
                <textarea
                  value={(site.staffOverview || []).map((s) => `${s.role}|${s.count}`).join("\n")}
                  onChange={(e) => {
                    const rows = e.target.value.split("\n").map((r) => r.trim()).filter(Boolean);
                    const staffOverview = rows.map((r) => {
                      const [role, count] = r.split("|");
                      return { role: (role || "").trim(), count: Number((count || "").trim()) };
                    }).filter((s) => s.role);
                    setSite({ ...site, staffOverview });
                  }}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Role|Count (one per line)"
                />
                <p className="text-xs text-gray-500">Format: <code>Role|Count</code> (one per line)</p>
              </div>

              <button type="submit" className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">
                Save Site Content
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
