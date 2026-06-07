import { createClient } from "@supabase/supabase-js";

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



export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Server-side Supabase client (API routes, server components). */
export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!serverClient) {
    serverClient = createClient(
      normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return serverClient;
}

/** Server-side Supabase storage client, using service role key when available. */
export function getSupabaseStorage() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;
  
  console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  if (!key) {
    throw new Error("Supabase storage requires SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const usingServiceRole = Boolean(serviceKey);
  console.log("Using service role:", usingServiceRole);
  
  // Log which credential type is being used for storage client (do not log secret values)
  console.log("getSupabaseStorage: initializing storage client", {
    usingServiceRole,
    keySource: usingServiceRole ? "SUPABASE_SERVICE_ROLE_KEY" : "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  });

  if (!serviceClient) {
    serviceClient = createClient(url, key, {
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
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin client.");
  }

  // create a separate singleton for admin client
  if (!serviceClient || serviceClient._isAnonClient) {
    // mark admin client by creating a fresh instance
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