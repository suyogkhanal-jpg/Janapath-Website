/**
 * Prepares a clean local dev environment:
 * - Stops stale processes on port 3000 (common cause of edits not showing)
 * - Clears corrupted Next.js webpack cache (fixes broken HMR on Windows)
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DEV_PORT = Number(process.env.PORT || 3000);
const ROOT = process.cwd();

function freePort(port) {
  if (process.platform === "win32") {
    try {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        if (!/LISTENING/i.test(line)) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
          console.log(`[dev] Stopped stale process on port ${port} (PID ${pid})`);
        } catch {
          // already exited
        }
      }
    } catch {
      // port not in use
    }
    return;
  }

  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, { stdio: "ignore", shell: true });
    console.log(`[dev] Stopped stale process on port ${port}`);
  } catch {
    // port not in use
  }
}

function rmDir(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return;
  fs.rmSync(full, { recursive: true, force: true });
  console.log(`[dev] Cleared ${relPath}`);
}

freePort(DEV_PORT);

const nextDir = path.join(ROOT, ".next");
const routesManifest = path.join(nextDir, "routes-manifest.json");
const buildManifest = path.join(nextDir, "BUILD_ID");

// Dev server crashes with "Internal Server Error" if .next was deleted/rebuilt
// while `next dev` was still running (e.g. after `npm run build`).
if (fs.existsSync(nextDir)) {
  const isProductionBuild = fs.existsSync(buildManifest);
  const isDevReady = fs.existsSync(routesManifest);
  if (isProductionBuild || !isDevReady) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log("[dev] Cleared .next (stale or production build artifacts)");
  } else {
    rmDir(".next/cache/webpack");
    rmDir(".next/cache/eslint");
  }
}

console.log(`[dev] Starting Next.js at http://localhost:${DEV_PORT}`);
