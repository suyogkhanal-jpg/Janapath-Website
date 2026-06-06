<<<<<<< HEAD
import crypto from "crypto";
import path from "path";
import { getSupabaseStorage } from "@/lib/supabase";

const STORAGE_BUCKET = "uploads";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]);
const IMAGE_MIME_PREFIX = "image/";

function getFileExtension(filename, contentType) {
  const extFromName = path.extname(filename || "").toLowerCase();
  if (ALLOWED_EXTENSIONS.has(extFromName)) return extFromName;
  const type = String(contentType || "").split("/").pop();
  if (type) return `.${type}`;
  return ".jpg";
}

function getStorageKey(filename) {
  return filename;
}

function parseStorageKeyFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/";
    const index = parsed.pathname.indexOf(marker);
    if (index >= 0) {
      const path = parsed.pathname.slice(index + marker.length);
      return path.startsWith(`${STORAGE_BUCKET}/`) ? path.slice(STORAGE_BUCKET.length + 1) : path;
    }
  } catch {
    // continue to fallback parsing
  }

  if (url.startsWith(`/${STORAGE_BUCKET}/`)) {
    return url.slice(STORAGE_BUCKET.length + 2);
  }
  if (url.startsWith(`${STORAGE_BUCKET}/`)) {
    return url.slice(STORAGE_BUCKET.length + 1);
  }
  return null;
}

export async function saveUploadedImage(file) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("File is required");
  }
  if (!file.size || file.size <= 0) {
    throw new Error("Image file is required");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image file must be smaller than 10MB");
  }

  const contentType = String(file.type || "").trim();
  if (!contentType.startsWith(IMAGE_MIME_PREFIX)) {
    throw new Error("Only image uploads are supported");
  }

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${getFileExtension(file.name, contentType)}`;
  const storageKey = getStorageKey(filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabaseStorage();

  console.log("Supabase storage upload", {
    bucket: STORAGE_BUCKET,
    filePath: storageKey,
    fileName: filename,
  });

  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(storageKey, bytes, {
    cacheControl: "3600",
    contentType,
    upsert: false,
  });

  if (uploadError) {
    console.error("Supabase storage upload failed", {
      bucket: STORAGE_BUCKET,
      filePath: storageKey,
      error: uploadError,
    });
    throw new Error(`Supabase storage upload failed: ${uploadError.message}`);
  }

  const { data: publicData, error: publicError } = await supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storageKey);
  if (publicError || !publicData?.publicUrl) {
    console.error("Supabase public URL generation failed", {
      bucket: STORAGE_BUCKET,
      filePath: storageKey,
      error: publicError,
      publicData,
    });
    throw new Error(`Unable to generate storage public URL: ${publicError?.message || "unknown error"}`);
  }

  return { url: publicData.publicUrl, path: storageKey };
}

export async function deleteUploadedImageByUrl(url) {
  const storageKey = parseStorageKeyFromUrl(url);
  if (!storageKey) return;

  const supabase = getSupabaseStorage();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([storageKey]);
  if (error) {
    throw new Error(`Failed to delete uploaded image: ${error.message}`);
=======
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
>>>>>>> d2f8d7893928863fe6bbbf76df4531f6d25db396
  }
}

