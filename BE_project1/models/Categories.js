import mongoose from"mongoose";

const categogySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    meta_title: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Category", categogySchema);
