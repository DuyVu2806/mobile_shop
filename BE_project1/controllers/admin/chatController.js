const Message = require("../../models/Message");

const contact = async (req, res) => {
  try {
    const data = await Message.find({ room_chat: req.params.id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { contact };
