import mongoose from"mongoose";

const wishlistSchema = mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      requried: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      requried: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", wishlistSchema);
