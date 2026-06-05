import { createClient } from "@supabase/supabase-js";

let serverClient = null;

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
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return serverClient;
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
