const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    images: { type: Array, required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variant_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
    description: { type: String, required: true },
    small_description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    rating: { type: Number, min: 0, default: 0 },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Product", productSchema);
