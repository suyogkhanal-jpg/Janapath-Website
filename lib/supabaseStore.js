import { getSupabase } from "@/lib/supabase";

const DEFAULT_KEY = "default";

function rowToNotice(row) {
  if (!row) return null;
  return {
    _id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    isPinned: row.is_pinned,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function noticeToRow(payload) {
  const row = {};
  if (payload.title != null) row.title = payload.title;
  if (payload.content != null) row.content = payload.content;
  if (payload.category != null) row.category = payload.category;
  if (typeof payload.isPinned === "boolean") row.is_pinned = payload.isPinned;
  if (payload.publishedAt != null) row.published_at = payload.publishedAt;
  return row;
}

function rowToGallery(row) {
  if (!row) return null;
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function galleryToRow(payload) {
  const row = {};
  if (payload.title != null) row.title = payload.title;
  if (payload.description != null) row.description = payload.description;
  if (payload.imageUrl != null) row.image_url = payload.imageUrl;
  if (payload.category != null) row.category = payload.category;
  if (typeof payload.featured === "boolean") row.featured = payload.featured;
  return row;
}

function rowToContact(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToSiteContent(row) {
  if (!row) return null;
  return {
    key: row.key,
    sliderTexts: row.slider_texts || [],
    logoUrl: row.logo_url,
    hero: row.hero || {},
    heroStats: row.hero_stats || [],
    principal: row.principal || {},
    about: row.about || {},
    staffOverview: row.staff_overview || [],
    mapEmbedUrl: row.map_embed_url || "",
    mapDirectionsUrl: row.map_directions_url || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function siteContentToRow(content) {
  return {
    key: DEFAULT_KEY,
    slider_texts: content.sliderTexts || [],
    logo_url: content.logoUrl,
    hero: content.hero || {},
    hero_stats: content.heroStats || [],
    principal: content.principal || {},
    about: content.about || {},
    staff_overview: content.staffOverview || [],
    map_embed_url: content.mapEmbedUrl || "",
    map_directions_url: content.mapDirectionsUrl || "",
  };
}

// --- Notices ---

export async function supabaseGetNotices({ limit = 20, category } = {}) {
  const supabase = getSupabase();
  let query = supabase
    .from("notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToNotice);
}

export async function supabaseCreateNotice(payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notices")
    .insert(noticeToRow(payload))
    .select()
    .single();
  if (error) throw error;
  return rowToNotice(data);
}

export async function supabaseUpdateNotice(id, updates) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("notices")
    .update(noticeToRow(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  if (!data) return null;
  return rowToNotice(data);
}

export async function supabaseDeleteNotice(id) {
  const supabase = getSupabase();
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// --- Gallery ---

export async function supabaseGetGallery() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(rowToGallery);
}

export async function supabaseFindGalleryByImageUrl(imageUrl) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("image_url", imageUrl)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToGallery(data) : null;
}

export async function supabaseCreateGalleryItem(payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .insert(galleryToRow(payload))
    .select()
    .single();
  if (error) throw error;
  return rowToGallery(data);
}

export async function supabaseGetGalleryById(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToGallery(data) : null;
}

export async function supabaseUpdateGalleryItem(id, updates) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .update(galleryToRow(updates))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  if (!data) return null;
  return rowToGallery(data);
}

export async function supabaseDeleteGalleryItem(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? rowToGallery(data) : null;
}

// --- Contacts ---

export async function supabaseGetContacts(limit = 50) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(rowToContact);
}

export async function supabaseCreateContact(payload) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      subject: payload.subject,
      message: payload.message,
      status: "new",
    })
    .select()
    .single();
  if (error) throw error;
  return rowToContact(data);
}

// --- Site content ---

export async function supabaseGetSiteContent() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("key", DEFAULT_KEY)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToSiteContent(data) : null;
}

export async function supabaseUpsertSiteContent(content) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("site_content")
    .upsert(siteContentToRow(content), { onConflict: "key" })
    .select()
    .single();
  if (error) throw error;
  return rowToSiteContent(data);
}
