import upload from "../helpers/uploadMiddleware.js";
import {updateUserAvatar} from "../controllers/usersControllers.js";
import express from "express";
import authMiddleware from "../helpers/authMiddleware.js";

const usersRouter = express.Router();

usersRouter.use(authMiddleware);

usersRouter.patch("/avatars", upload.single("avatar"), updateUserAvatar);

export default usersRouter;
