const PUBLIC_CACHE = "public, s-maxage=60, stale-while-revalidate=120";

export function apiSuccess(data, status = 200, headers = {}) {
  return Response.json({ success: true, data }, { status, headers });
}

export function apiSuccessCached(data, status = 200) {
  return apiSuccess(data, status, { "Cache-Control": PUBLIC_CACHE });
}

export function apiError(message, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

export function validateRequired(fields, body) {
  const missing = fields.filter((f) => !body[f]?.toString().trim());
  if (missing.length) {
    return `Missing required fields: ${missing.join(", ")}`;
  }
  return null;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
