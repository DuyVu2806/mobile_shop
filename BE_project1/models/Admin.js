const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", adminSchema);
