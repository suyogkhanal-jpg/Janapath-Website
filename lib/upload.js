import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveUploadedImage(file) {
  if (!file) throw new Error("File is required");
  if (typeof file.arrayBuffer !== "function") throw new Error("Invalid file");

  const contentType = file.type || "";
  if (!contentType.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }

  const extFromName = path.extname(file.name || "").toLowerCase();
  const ext = extFromName || ".jpg";

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
  const absPath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absPath, buffer);

  return { url: `/uploads/${filename}`, absPath };
}

export async function deleteUploadedImageByUrl(url) {
  if (!url || typeof url !== "string") return;
  if (!url.startsWith("/uploads/")) return;
  const filename = url.slice("/uploads/".length);
  if (!filename) return;
  const absPath = path.join(UPLOAD_DIR, filename);
  try {
    await unlink(absPath);
  } catch {
    // ignore missing file
  }
}

