import { connectDB, isMongoDBConfigured } from "@/lib/mongodb";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  supabaseGetNotices,
  supabaseCreateNotice,
  supabaseUpdateNotice,
  supabaseDeleteNotice,
} from "@/lib/supabaseStore";
import Notice from "@/models/Notice";
import { apiSuccess, apiError, validateRequired } from "@/lib/api";
import { verifyAdminRequest } from "@/lib/auth";
import {
  getMemoryNotices,
  addMemoryNotice,
  updateMemoryNotice,
  deleteMemoryNotice,
} from "@/lib/memoryStore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const category = searchParams.get("category");

    if (isSupabaseConfigured()) {
      try {
        const notices = await supabaseGetNotices({ limit, category });
        return apiSuccess(notices);
      } catch {
        // fall back
      }
    }

    if (isMongoDBConfigured()) {
      try {
        await connectDB();
        const query = category ? { category } : {};
        const notices = await Notice.find(query)
          .sort({ isPinned: -1, publishedAt: -1 })
          .limit(limit)
          .lean();
        return apiSuccess(notices);
      } catch {
        // fall back
      }
    }

    let notices = getMemoryNotices();
    if (category) notices = notices.filter((n) => n.category === category);
    return apiSuccess(notices.slice(0, limit));
  } catch (err) {
    return apiError(err.message || "Failed to fetch notices", 500);
  }
}

export async function POST(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const missing = validateRequired(["title", "content"], body);
    if (missing) return apiError(missing);

    const payload = {
      title: body.title.trim(),
      content: body.content.trim(),
      category: body.category || "General",
      isPinned: Boolean(body.isPinned),
      publishedAt: body.publishedAt ? new Date(body.publishedAt).toISOString() : new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const notice = await supabaseCreateNotice(payload);
        return apiSuccess(notice, 201);
      } catch {
        // fall back
      }
    }

    if (isMongoDBConfigured()) {
      try {
        await connectDB();
        const notice = await Notice.create({
          ...payload,
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
        });
        return apiSuccess(notice, 201);
      } catch {
        // fall back
      }
    }

    return apiSuccess(addMemoryNotice(payload), 201);
  } catch (err) {
    return apiError(err.message || "Failed to create notice", 500);
  }
}

export async function PUT(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    if (!body.id) return apiError("Notice id is required");

    const updates = {};
    if (body.title) updates.title = body.title.trim();
    if (body.content) updates.content = body.content.trim();
    if (body.category) updates.category = body.category;
    if (typeof body.isPinned === "boolean") updates.isPinned = body.isPinned;

    if (isSupabaseConfigured()) {
      try {
        const notice = await supabaseUpdateNotice(body.id, updates);
        if (!notice) return apiError("Notice not found", 404);
        return apiSuccess(notice);
      } catch {
        // fall back
      }
    }

    if (isMongoDBConfigured()) {
      try {
        await connectDB();
        const notice = await Notice.findByIdAndUpdate(body.id, updates, { new: true });
        if (!notice) return apiError("Notice not found", 404);
        return apiSuccess(notice);
      } catch {
        // fall back
      }
    }

    const updated = updateMemoryNotice(body.id, updates);
    if (!updated) return apiError("Notice not found", 404);
    return apiSuccess(updated);
  } catch (err) {
    return apiError(err.message || "Failed to update notice", 500);
  }
}

export async function DELETE(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Notice id is required");

    if (isSupabaseConfigured()) {
      try {
        await supabaseDeleteNotice(id);
        return apiSuccess({ deleted: true });
      } catch (err) {
        if (err?.code === "PGRST116") return apiError("Notice not found", 404);
        // fall back
      }
    }

    if (isMongoDBConfigured()) {
      try {
        await connectDB();
        const result = await Notice.findByIdAndDelete(id);
        if (!result) return apiError("Notice not found", 404);
        return apiSuccess({ deleted: true });
      } catch {
        // fall back
      }
    }

    if (!deleteMemoryNotice(id)) return apiError("Notice not found", 404);
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiError(err.message || "Failed to delete notice", 500);
  }
}
