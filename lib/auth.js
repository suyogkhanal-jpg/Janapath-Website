import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@janapath.com",
    password: process.env.ADMIN_PASSWORD || "admin1234",
  };
}

export function verifyAdminRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded?.role || decoded.role !== "admin") return null;
  return decoded;
}
