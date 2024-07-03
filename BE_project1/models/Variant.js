import mongoose from "mongoose";

const variantSchema = mongoose.Schema({
  color: { type: String, required: true },
  other: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});
export default mongoose.model("Variant", variantSchema);
