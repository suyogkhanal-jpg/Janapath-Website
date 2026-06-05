import { connectDB, isMongoDBConfigured } from "@/lib/mongodb";
import { isSupabaseConfigured } from "@/lib/supabase";
import { supabaseGetContacts, supabaseCreateContact } from "@/lib/supabaseStore";
import Contact from "@/models/Contact";
import { apiSuccess, apiError, validateRequired, validateEmail } from "@/lib/api";
import { verifyAdminRequest } from "@/lib/auth";
import { addMemoryContact } from "@/lib/memoryStore";

export async function GET(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    if (isSupabaseConfigured()) {
      try {
        const contacts = await supabaseGetContacts(50);
        return apiSuccess(contacts);
      } catch {
        // fall back
      }
    }

    if (isMongoDBConfigured()) {
      try {
        await connectDB();
        const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50).lean();
        return apiSuccess(contacts);
      } catch {
        // fall back
      }
    }
    return apiSuccess([]);
  } catch (err) {
    return apiError(err.message || "Failed to fetch contacts", 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const missing = validateRequired(["name", "email", "subject", "message"], body);
    if (missing) return apiError(missing);
    if (!validateEmail(body.email)) return apiError("Invalid email address");

    const payload = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || "",
      subject: body.subject.trim(),
      message: body.message.trim(),
    };

    if (payload.message.length < 10) {
      return apiError("Message must be at least 10 characters");
    }

    if (isSupabaseConfigured()) {
      try {
        const contact = await supabaseCreateContact(payload);
        return apiSuccess(contact, 201);
      } catch {
        // fall back
      }
    }

    if (isMongoDBConfigured()) {
      try {
        await connectDB();
        const contact = await Contact.create(payload);
        return apiSuccess(contact, 201);
      } catch {
        // fall back
      }
    }

    return apiSuccess(addMemoryContact(payload), 201);
  } catch (err) {
    return apiError(err.message || "Failed to submit contact form", 500);
  }
}
