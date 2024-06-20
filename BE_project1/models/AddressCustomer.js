const mongoose = require("mongoose");

const customerAddressSchema = mongoose.Schema({
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
  selected: { type: Boolean, default: false },
});

module.exports = mongoose.model("Customer_Address", customerAddressSchema);
