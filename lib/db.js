import { isSupabaseConfigured } from "@/lib/supabase";
import { isMongoDBConfigured } from "@/lib/mongodb";

/** Supabase is preferred when configured; MongoDB is legacy fallback. */
export function isDBConfigured() {
  return isSupabaseConfigured() || isMongoDBConfigured();
}

export function getPrimaryDB() {
  if (isSupabaseConfigured()) return "supabase";
  if (isMongoDBConfigured()) return "mongodb";
  return "memory";
}
