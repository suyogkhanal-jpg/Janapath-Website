import mongoose from "mongoose";

const StaffCountSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const HeroStatSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    sliderTexts: { type: [String], default: [] },
    logoUrl: { type: String, trim: true, default: "/logo.png" },
    hero: {
      backgroundImageUrl: { type: String, trim: true, default: "/images/campus.jpg" },
      imageOpacity: { type: Number, default: 10, min: 0, max: 100 },
      overlayOpacity: { type: Number, default: 80, min: 0, max: 100 },
    },
    heroStats: { type: [HeroStatSchema], default: [] },
    principal: {
      name: { type: String, trim: true, default: "Principal" },
      title: { type: String, trim: true, default: "Principal, Janapath Secondary School" },
      message: { type: String, trim: true, default: "" },
      imageUrl: { type: String, trim: true, default: "" },
    },
    about: {
      intro: { type: String, trim: true, default: "" },
      history: { type: String, trim: true, default: "" },
      mission: { type: String, trim: true, default: "" },
      vision: { type: String, trim: true, default: "" },
    },
    staffOverview: { type: [StaffCountSchema], default: [] },
    mapEmbedUrl: { type: String, trim: true, default: "" },
    mapDirectionsUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);
