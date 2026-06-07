import { getSiteContent } from "@/lib/siteStore";

function isPng(buffer) {
  if (!buffer || buffer.byteLength < 26) return false;
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const arr = new Uint8Array(buffer.slice(0, 8));
  for (let i = 0; i < 8; i++) if (arr[i] !== sig[i]) return false;
  return true;
}

export async function GET() {
  try {
    const content = await getSiteContent();
    const logoUrl = content?.logoUrl || null;
    if (!logoUrl) return new Response(JSON.stringify({ ok: false, reason: "no_logo_url" }), { status: 200 });

    const res = await fetch(logoUrl);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, reason: "fetch_failed", status: res.status, statusText: res.statusText }),
        { status: 200 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    const contentLength = res.headers.get("content-length") || null;
    const buffer = await res.arrayBuffer();

    const result = {
      ok: true,
      logoUrl,
      contentType,
      contentLength,
      isPng: isPng(buffer),
      hasAlpha: null,
    };

    if (result.isPng) {
      const bytes = new Uint8Array(buffer);
      // PNG IHDR color type is at byte index 25 (0-based)
      const colorType = bytes[25];
      // colorType 4 and 6 include alpha channel
      result.colorType = colorType;
      result.hasAlpha = colorType === 4 || colorType === 6;
    }

    return new Response(JSON.stringify(result, null, 2), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, reason: "exception", message: String(err) }), { status: 500 });
  }
}
