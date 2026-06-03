import { apiSuccess, apiError } from "@/lib/api";
import { getAdminCredentials, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError("Email and password are required");
    }

    const admin = getAdminCredentials();
    if (
      email.trim().toLowerCase() !== admin.email.toLowerCase() ||
      password !== admin.password
    ) {
      return apiError("Invalid credentials", 401);
    }

    const token = signToken({ email: admin.email, role: "admin" });
    return apiSuccess({ token, email: admin.email });
  } catch (err) {
    return apiError(err.message || "Login failed", 500);
  }
}
