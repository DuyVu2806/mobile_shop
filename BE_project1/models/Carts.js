import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    // required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  checkItem: { type: Boolean, default: false },
});

export default mongoose.model("Cart", cartSchema);
