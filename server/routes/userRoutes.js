import express from "express";
import {
  getPublishedImages,
  getUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRoouter = express.Router();

userRoouter.post("/register", registerUser);
userRoouter.post("/login", loginUser);
userRoouter.get("/data", protect, getUser);
userRoouter.get("/published-images", getPublishedImages);

export default userRoouter;
