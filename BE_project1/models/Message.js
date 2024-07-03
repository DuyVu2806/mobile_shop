import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    room_chat: {
      type: mongoose.Schema.Types.ObjectId,
      requried: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export { Message };
