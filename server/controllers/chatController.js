import Chat from "../models/Chat.js";

// API controller for creting new chat

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };
    await Chat.create(chatData);
    res.json({ success: true, message: "Chat created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API controller for getting all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json({ success: true, chat });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API controller for getting all chats
export const deleteChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    res.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
