import Message from "../../models/Message";

const index = async (req, res) => {
  try {
    const data = await Message.find({ room_chat: req.cus.id });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};
export { index };
