import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    order_code: { type: String, required: true, unique: true },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    district_code: { type: Number, required: true },
    province: { type: String, required: true },
    province_code: { type: Number, required: true },
    ward: { type: String, required: true },
    ward_code: { type: Number, required: true },
    address: { type: String, required: true },
    total_price: { type: Number, required: true, min: 0 },
    shipping_fee: { type: Number, required: true, min: 0 },
    status_message: {
      type: String,
      default: "In Progress",
      enum: ["In Progress", "Pending", "Delivery", "Cancelled"],
    },
    payment_mode: { type: String, required: true },
    payment_id: { type: Number, default: null },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Order", orderSchema);
