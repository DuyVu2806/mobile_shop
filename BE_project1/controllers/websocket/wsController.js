import Message from "../../models/Message.js";
import Contact from "../../models/Contact.js";
import Websocket from "ws";

const clients = new Map();

const handleConnection = (ws, wss) => {
  console.log("A client connected");

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(parsedMessage);

      if (parsedMessage.sender == parsedMessage.room_chat) {
        await Contact.findOneAndUpdate(
          { room_chat: parsedMessage.room_chat },
          { last_message: parsedMessage.content, updatedAt: new Date() },
          { new: true }
        ).exec();
      }

      if (parsedMessage.type === "join") {
        clients.set(ws, parsedMessage.room_chat);
      } else if (parsedMessage.sender && parsedMessage.recipient) {
        const newMessage = new Message({
          room_chat: parsedMessage.room_chat,
          content: parsedMessage.content,
          sender: parsedMessage.sender,
          recipient: parsedMessage.recipient,
        });

        const savedMessage = await newMessage.save();

        wss.clients.forEach((client) => {
          if (
            client.readyState === Websocket.OPEN &&
            client !== ws &&
            clients.get(client) === parsedMessage.room_chat
          ) {
            client.send(JSON.stringify(savedMessage));
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  ws.on("close", () => {
    console.log("A client disconnected");
  });

  ws.on("error", console.error);
};

export default {
  handleConnection,
};
