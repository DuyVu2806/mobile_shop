const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  rstatus: { type: Boolean, default: false },
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
