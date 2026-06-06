import { apiSuccess, apiError } from "@/lib/api";
import { verifyAdminRequest } from "@/lib/auth";
import { getSiteContent, updateSiteContent } from "@/lib/siteStore";
import { saveUploadedImage, deleteUploadedImageByUrl } from "@/lib/upload";

export async function GET() {
  try {
    const content = await getSiteContent();
    return Response.json(
      { success: true, data: content },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    return apiError(err.message || "Failed to fetch site content", 500);
  }
}

export async function PUT(request) {
  const admin = verifyAdminRequest(request);
  if (!admin) return apiError("Unauthorized", 401);

  try {
    const current = await getSiteContent();
    const form = await request.formData();

    const sliderTextsRaw = form.get("sliderTexts");
    const sliderTexts = sliderTextsRaw ? JSON.parse(String(sliderTextsRaw)) : current.sliderTexts;

    const staffOverviewRaw = form.get("staffOverview");
    const staffOverview = staffOverviewRaw ? JSON.parse(String(staffOverviewRaw)) : current.staffOverview;

    const heroStatsRaw = form.get("heroStats");
    const heroStats = heroStatsRaw ? JSON.parse(String(heroStatsRaw)) : current.heroStats;

    const principalName = form.get("principalName");
    const principalTitle = form.get("principalTitle");
    const principalMessage = form.get("principalMessage");

    const aboutIntro = form.get("aboutIntro");
    const aboutHistory = form.get("aboutHistory");
    const aboutMission = form.get("aboutMission");
    const aboutVision = form.get("aboutVision");

    const heroImageOpacity = form.get("heroImageOpacity");
    const heroOverlayOpacity = form.get("heroOverlayOpacity");

    const mapEmbedUrl = form.get("mapEmbedUrl");
    const mapDirectionsUrl = form.get("mapDirectionsUrl");

    let principalImageUrl = current.principal.imageUrl;
    const principalImage = form.get("principalImage");
    if (principalImage && typeof principalImage === "object" && principalImage.size) {
      const uploaded = await saveUploadedImage(principalImage);
      await deleteUploadedImageByUrl(principalImageUrl);
      principalImageUrl = uploaded.url;
    }

    let logoUrl = current.logoUrl;
    const logoImage = form.get("logoImage");
    if (logoImage && typeof logoImage === "object" && logoImage.size) {
      const uploaded = await saveUploadedImage(logoImage);
      await deleteUploadedImageByUrl(logoUrl);
      logoUrl = uploaded.url;
    }

    let heroBackgroundUrl = current.hero.backgroundImageUrl;
    const heroBackgroundImage = form.get("heroBackgroundImage");
    if (heroBackgroundImage && typeof heroBackgroundImage === "object" && heroBackgroundImage.size) {
      const uploaded = await saveUploadedImage(heroBackgroundImage);
      await deleteUploadedImageByUrl(heroBackgroundUrl);
      heroBackgroundUrl = uploaded.url;
    }

    const next = await updateSiteContent({
      sliderTexts,
      staffOverview,
      heroStats,
      logoUrl,
      hero: {
        backgroundImageUrl: heroBackgroundUrl,
        imageOpacity:
          heroImageOpacity != null ? Number(heroImageOpacity) : current.hero.imageOpacity,
        overlayOpacity:
          heroOverlayOpacity != null ? Number(heroOverlayOpacity) : current.hero.overlayOpacity,
      },
      principal: {
        ...current.principal,
        name: principalName != null ? String(principalName) : current.principal.name,
        title: principalTitle != null ? String(principalTitle) : current.principal.title,
        message: principalMessage != null ? String(principalMessage) : current.principal.message,
        imageUrl: principalImageUrl,
      },
      about: {
        ...current.about,
        intro: aboutIntro != null ? String(aboutIntro) : current.about.intro,
        history: aboutHistory != null ? String(aboutHistory) : current.about.history,
        mission: aboutMission != null ? String(aboutMission) : current.about.mission,
        vision: aboutVision != null ? String(aboutVision) : current.about.vision,
      },
      mapEmbedUrl:
        mapEmbedUrl != null ? String(mapEmbedUrl).trim() : current.mapEmbedUrl,
      mapDirectionsUrl:
        mapDirectionsUrl != null ? String(mapDirectionsUrl).trim() : current.mapDirectionsUrl,
    });

    return apiSuccess(next);
  } catch (err) {
    return apiError(err.message || "Failed to update site content", 500);
  }
}
