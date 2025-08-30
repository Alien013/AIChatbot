import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  ImageMessageController,
  textMessageController,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/text", protect, textMessageController);
messageRouter.post("/image", protect, ImageMessageController);

export default messageRouter;
