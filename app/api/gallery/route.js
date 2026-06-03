import { connectDB, isDBConfigured } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import { apiSuccess, apiError, validateRequired } from "@/lib/api";
import { verifyAdminRequest } from "@/lib/auth";
import {
  getMemoryGallery,
  addMemoryGalleryItem,
  deleteMemoryGalleryItem,
  updateMemoryGalleryItem,
} from "@/lib/memoryStore";
import { saveUploadedImage, deleteUploadedImageByUrl } from "@/lib/upload";
import { defaultGallery } from "@/lib/gallerySeed";

async function ensureGallerySeeded() {
  for (const seed of defaultGallery) {
    const exists = await Gallery.findOne({ imageUrl: seed.imageUrl }).lean();
    if (!exists) {
      const { _id, ...item } = seed;
      await Gallery.create(item);
    }
  }
}

export async function GET() {
  try {
    if (isDBConfigured()) {
      try {
        await connectDB();
        await ensureGallerySeeded();
        const items = await Gallery.find().sort({ featured: -1, createdAt: -1 }).lean();
        return apiSuccess(items);
      } catch {
        // If MongoDB is configured but unavailable, fall back to in-memory data
      }
    }
    return apiSuccess(getMemoryGallery());
  } catch (err) {
    return apiError(err.message || "Failed to fetch gallery", 500);
  }
}

export async function POST(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const form = await request.formData();
    const title = form.get("title");
    const missingTitle = validateRequired(["title"], { title });
    if (missingTitle) return apiError(missingTitle);

    const file = form.get("image");
    if (!file || typeof file !== "object" || !file.size) {
      return apiError("Image file is required");
    }

    const uploaded = await saveUploadedImage(file);

    const payload = {
      title: String(title).trim(),
      description: (form.get("description") || "").toString().trim(),
      imageUrl: uploaded.url,
      category: (form.get("category") || "Campus").toString(),
      featured: form.get("featured") === "true",
    };

    if (isDBConfigured()) {
      try {
        await connectDB();
        const item = await Gallery.create(payload);
        return apiSuccess(item, 201);
      } catch {
        // fall back to in-memory store
      }
    }

    return apiSuccess(addMemoryGalleryItem(payload), 201);
  } catch (err) {
    return apiError(err.message || "Failed to add gallery item", 500);
  }
}

export async function PUT(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const form = await request.formData();
    const id = form.get("id");
    if (!id) return apiError("Gallery id is required");

    const updates = {};
    if (form.get("title") != null) updates.title = String(form.get("title")).trim();
    if (form.get("description") != null) updates.description = String(form.get("description")).trim();
    if (form.get("category") != null) updates.category = String(form.get("category"));
    if (form.get("featured") != null) updates.featured = form.get("featured") === "true";

    const file = form.get("image");

    if (isDBConfigured()) {
      try {
        await connectDB();
        const existing = await Gallery.findById(id).lean();
        if (!existing) return apiError("Item not found", 404);

        if (file && typeof file === "object" && file.size) {
          const uploaded = await saveUploadedImage(file);
          updates.imageUrl = uploaded.url;
          await deleteUploadedImageByUrl(existing.imageUrl);
        }

        const updated = await Gallery.findByIdAndUpdate(id, updates, { new: true }).lean();
        return apiSuccess(updated);
      } catch {
        // fall back to in-memory store
      }
    }

    const existing = getMemoryGallery().find((g) => g._id === id);
    if (!existing) return apiError("Item not found", 404);

    if (file && typeof file === "object" && file.size) {
      const uploaded = await saveUploadedImage(file);
      updates.imageUrl = uploaded.url;
      await deleteUploadedImageByUrl(existing.imageUrl);
    }

    const updated = updateMemoryGalleryItem(id, updates);
    if (!updated) return apiError("Item not found", 404);
    return apiSuccess(updated);
  } catch (err) {
    return apiError(err.message || "Failed to update gallery item", 500);
  }
}

export async function DELETE(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Gallery id is required");

    if (isDBConfigured()) {
      try {
        await connectDB();
        const result = await Gallery.findByIdAndDelete(id).lean();
        if (!result) return apiError("Item not found", 404);
        await deleteUploadedImageByUrl(result.imageUrl);
        return apiSuccess({ deleted: true });
      } catch {
        // fall back to in-memory store
      }
    }

    const existing = getMemoryGallery().find((g) => g._id === id);
    if (!deleteMemoryGalleryItem(id)) return apiError("Item not found", 404);
    if (existing) await deleteUploadedImageByUrl(existing.imageUrl);
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiError(err.message || "Failed to delete gallery item", 500);
  }
}
