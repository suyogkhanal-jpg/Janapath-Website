import { createClient } from "@supabase/supabase-js";

const STORAGE_BUCKET = "uploads";
let serverClient = null;
let serviceClient = null;

function normalizeSupabaseUrl(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname.replace(/\/(?:rest|storage)\/v1\/?$/, "");
    if (parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return String(url).replace(/\/(?:rest|storage)\/v1\/?$/, "").replace(/\/$/, "");
  }
}

function getSupabaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!rawUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for Supabase clients.");
  }
  return normalizeSupabaseUrl(rawUrl);
}

function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for Supabase storage uploads. " +
        "Do not fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY for server-side uploads."
    );
  }
  return key;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseServiceRoleConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

console.log("Supabase service role exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log("Supabase storage bucket:", STORAGE_BUCKET);

/** Server-side Supabase client (API routes, server components). */
export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  if (!serverClient) {
    serverClient = createClient(getSupabaseUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serverClient;
}

/**
 * Server-side Supabase storage client, always using the service role key.
 */
export function getSupabaseStorage() {
  const url = getSupabaseUrl();
  const serviceKey = getServiceRoleKey();

  console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!serviceKey);
  console.log("Using service role:", true);
  console.log("Storage URL:", url);
  console.log("Supabase storage key source: SUPABASE_SERVICE_ROLE_KEY");
  console.log({
    serviceRoleExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    usingServiceRole: true,
    keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  });
  console.log("Supabase storage bucket:", STORAGE_BUCKET);

  if (!serviceClient) {
    serviceClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}

/**
 * Explicit admin client that always uses the service role key.
 * Use this for server-side DB writes that must bypass RLS.
 */
export function getSupabaseAdmin() {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();

  if (!serviceClient) {
    serviceClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  console.log("getSupabaseAdmin: admin client initialized (service role present)");
  return serviceClient;
}

/** Map Supabase `id` to Mongo-style `_id` for existing frontend/admin code. */
export function withMongoId(row) {
  if (!row) return row;
  const { id, ...rest } = row;
  return { ...rest, _id: id };
}

export function withMongoIds(rows) {
  return (rows || []).map(withMongoId);
}
