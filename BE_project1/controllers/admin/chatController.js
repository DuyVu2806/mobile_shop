const Contact = require("../../models/Contact");
const Message = require("../../models/Message");

const contact = async (req, res) => {
  try {
    const data = await Message.find({ room_chat: req.params.id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const contacts = async (req, res) => {
  try {
    const data = await Contact.find().populate({
      select: "_id, fullname",
      path: "room_chat",
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { contact, contacts };
