const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // Socket IO
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];

      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }

      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // Trả data về Client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });
    });

    // Tying
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
  // Lấy data từ database
  const chats = await Chat.find({
    deleted: false,
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
