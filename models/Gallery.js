import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Campus",
        "Events",
        "Sports",
        "Labs",
        "Students",
        "Library",
        "Classrooms",
        "Science Lab",
        "Computer Lab",
      ],
      default: "Campus",
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
