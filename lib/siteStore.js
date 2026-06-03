import { connectDB, isDBConfigured } from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";
import { aboutContent, principalMessage, staffOverview } from "@/lib/data";
import { MAP_DIRECTIONS_URL, MAP_EMBED_URL } from "@/lib/teachers";

const DEFAULT_KEY = "default";

const DEFAULT_HERO_STATS = [
  { value: "1200+", label: "Students" },
  { value: "35+", label: "Teachers" },
  { value: "12+", label: "Years" },
  { value: "95%", label: "Pass Rate" },
];

const memory = {
  sliderTexts: [],
  logoUrl: "/logo.png",
  hero: {
    backgroundImageUrl: "/images/campus.jpg",
    imageOpacity: 100,
    overlayOpacity: 55,
  },
  heroStats: DEFAULT_HERO_STATS,
  principal: {
    name: principalMessage.name,
    title: principalMessage.title,
    message: principalMessage.message,
    imageUrl: principalMessage.image,
  },
  about: {
    intro: aboutContent.intro,
    history: aboutContent.history,
    mission: aboutContent.mission,
    vision: aboutContent.vision,
  },
  staffOverview: staffOverview,
  mapEmbedUrl: MAP_EMBED_URL,
  mapDirectionsUrl: MAP_DIRECTIONS_URL,
};

function clampPercent(n, fallback) {
  const num = Number(n);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(100, Math.max(0, num));
}

function normalize(payload) {
  const next = { ...memory, ...(payload || {}) };

  next.sliderTexts = Array.isArray(next.sliderTexts)
    ? next.sliderTexts.map((s) => (s ?? "").toString().trim()).filter(Boolean)
    : [];

  next.logoUrl = next.logoUrl?.toString().trim() || "/logo.png";

  next.hero = {
    backgroundImageUrl:
      next.hero?.backgroundImageUrl?.toString().trim() || "/images/campus.jpg",
    imageOpacity: clampPercent(next.hero?.imageOpacity, 100),
    overlayOpacity: clampPercent(next.hero?.overlayOpacity, 55),
  };

  next.heroStats = Array.isArray(next.heroStats) && next.heroStats.length
    ? next.heroStats
        .map((s) => ({
          value: (s?.value ?? "").toString().trim(),
          label: (s?.label ?? "").toString().trim(),
        }))
        .filter((s) => s.value && s.label)
    : DEFAULT_HERO_STATS;

  next.principal = {
    name: next.principal?.name?.toString().trim() || "",
    title: next.principal?.title?.toString().trim() || "",
    message: next.principal?.message?.toString().trim() || "",
    imageUrl: next.principal?.imageUrl?.toString().trim() || "/images/principal.png",
  };

  next.mapEmbedUrl = next.mapEmbedUrl?.toString().trim() || MAP_EMBED_URL;
  next.mapDirectionsUrl = next.mapDirectionsUrl?.toString().trim() || MAP_DIRECTIONS_URL;

  next.about = {
    intro: next.about?.intro?.toString().trim() || "",
    history: next.about?.history?.toString().trim() || "",
    mission: next.about?.mission?.toString().trim() || "",
    vision: next.about?.vision?.toString().trim() || "",
  };

  next.staffOverview = Array.isArray(next.staffOverview)
    ? next.staffOverview
        .map((s) => ({
          role: (s?.role ?? "").toString().trim(),
          count: Number(s?.count ?? 0),
        }))
        .filter((s) => s.role && Number.isFinite(s.count) && s.count >= 0)
    : [];

  return next;
}

export async function getSiteContent() {
  if (isDBConfigured()) {
    try {
      await connectDB();
      const doc = await SiteContent.findOne({ key: DEFAULT_KEY }).lean();
      return normalize(doc || {});
    } catch {
      // fall back to memory
    }
  }
  return normalize(memory);
}

export async function updateSiteContent(partial) {
  const next = normalize({ ...(await getSiteContent()), ...(partial || {}) });

  if (isDBConfigured()) {
    try {
      await connectDB();
      const doc = await SiteContent.findOneAndUpdate(
        { key: DEFAULT_KEY },
        { key: DEFAULT_KEY, ...next },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      return normalize(doc || next);
    } catch {
      // fall back to memory update
    }
  }

  memory.sliderTexts = next.sliderTexts;
  memory.logoUrl = next.logoUrl;
  memory.hero = next.hero;
  memory.heroStats = next.heroStats;
  memory.principal = next.principal;
  memory.about = next.about;
  memory.staffOverview = next.staffOverview;
  memory.mapEmbedUrl = next.mapEmbedUrl;
  memory.mapDirectionsUrl = next.mapDirectionsUrl;
  return next;
}
