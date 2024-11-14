
import { Router } from "express";
import { AddProfileImg, GetUserInfo, Login, Logout, RemoveImg, SignUp, UpdateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

import multer from "multer";
const mult = multer({ dest: "upload/profiles/" })
const authRoutes = Router();

authRoutes.post("/signup", SignUp);
authRoutes.post("/login", Login);
authRoutes.get("/userInfo", verifyToken, GetUserInfo);
authRoutes.post("/updateProfile", verifyToken, UpdateProfile);
authRoutes.post("/add_profile_img", verifyToken, mult.single("profileImg"), AddProfileImg);
authRoutes.delete("/deleteImg", verifyToken, RemoveImg);
authRoutes.post("/logout", Logout);

export default authRoutes