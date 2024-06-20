const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Role", roleSchema);
