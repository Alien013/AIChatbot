import Chat from "../models/Chat.js";

// API controller for creating new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
      userName: req.user.name,
    };

    const chat = await Chat.create(chatData);

    // Return the full created chat so the frontend can set state immediately
    const fullChat = await Chat.findById(chat._id).lean();

    return res
      .status(201)
      .json({
        success: true,
        message: "Chat created successfully",
        chat: fullChat,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API controller for getting all chats
export const getChats = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).lean();

    // Return 'chats' (plural) to match the frontend
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// API controller for deleting a chat
export const deleteChats = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!chatId) {
      return res
        .status(400)
        .json({ success: false, message: "chatId is required" });
    }

    const result = await Chat.deleteOne({ _id: chatId, userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// import Chat from "../models/Chat.js";

// // API controller for creting new chat

// export const createChat = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const chatData = {
//       userId,
//       messages: [],
//       name: "New Chat",
//       userName: req.user.name,
//     };
//     await Chat.create(chatData);
//     res.json({ success: true, message: "Chat created successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // API controller for getting all chats
// export const getChats = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const chat = await Chat.find({ userId }).sort({ updatedAt: -1 });

//     res.json({ success: true, chat });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // API controller for getting all chats
// export const deleteChats = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { chatId } = req.body;

//     await Chat.deleteOne({ _id: chatId, userId });

//     res.json({ success: true, message: "Chat deleted successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
