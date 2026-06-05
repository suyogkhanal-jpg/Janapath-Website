/**
 * Quick Supabase connectivity check.
 * Usage: node scripts/test-supabase.js
 */
require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log("Connecting to:", url);

  const tables = ["notices", "gallery", "contacts", "site_content"];
  for (const table of tables) {
    const { error } = await supabase.from(table).select("id", { count: "exact", head: true });
    



    if (error) {
      console.error(`  ✗ ${table}: ${error.message}`);
      if (error.message.includes("does not exist") || error.code === "42P01") {
        console.log("\n→ Run supabase/schema.sql in your Supabase SQL Editor first.");
      }
      process.exit(1);
    }

    
    console.log(`  ✓ ${table}: OK`);
  }

  console.log("\nSupabase connected successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
