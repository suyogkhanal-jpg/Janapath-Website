import crypto from "crypto";
import sharp from "sharp";
import { getSupabaseStorage } from "@/lib/supabase";

const STORAGE_BUCKET = "uploads";

function getFileExtension(filename, contentType) {
  const ext = filename?.toLowerCase().match(/\.[^.]*$/)?.[0];
  if (ext) return ext;
  
  const type = String(contentType || "").split("/").pop();
  if (type) return `.${type}`;
  return ".jpg";
}

export async function saveUploadedImage(file) {
  if (!file) throw new Error("File is required");
  if (typeof file.arrayBuffer !== "function") throw new Error("Invalid file");

  const contentType = String(file.type || "").trim();
  if (!contentType.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Convert image to PNG format with transparency support
  let pngBuffer;
  try {
    pngBuffer = await sharp(buffer)
      .png({ quality: 90, progressive: true })
      .toBuffer();
  } catch (err) {
    console.error("Failed to convert image to PNG:", err);
    throw new Error(`Failed to convert image to PNG: ${err.message}`);
  }

  // Generate filename with .png extension
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.png`;

  const supabase = getSupabaseStorage();

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, pngBuffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase storage upload failed:", uploadError);
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: publicData, error: publicError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);

  if (publicError || !publicData?.publicUrl) {
    console.error("Supabase public URL generation failed:", publicError);
    throw new Error(`Failed to generate public URL: ${publicError?.message || "unknown error"}`);
  }

  return { url: publicData.publicUrl, path: filename };
}

export async function deleteUploadedImageByUrl(url) {
  if (!url || typeof url !== "string") return;

  // Extract the file path from the Supabase public URL
  // URL format: https://[project-id].supabase.co/storage/v1/object/public/uploads/[filename]
  const match = url.match(/\/storage\/v1\/object\/public\/uploads\/(.+)$/);
  if (!match || !match[1]) return;

  const filename = match[1];

  try {
    const supabase = getSupabaseStorage();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename]);

    if (error) {
      console.error("Failed to delete image from Supabase:", error);
      // Don't throw - silently fail as the image may already be deleted
    }
  } catch (err) {
    // Silently ignore errors
    console.error("Error deleting image:", err);
  }
}

