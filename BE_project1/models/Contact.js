const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    room_chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    last_message: { type: String, default: "No messages" },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
