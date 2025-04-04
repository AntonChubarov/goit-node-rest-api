import express from "express";
import {getCurrentUser, login, logout, register, updateSubscription} from "../controllers/authControllers.js";
import authMiddleware from "../helpers/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);
authRouter.patch("/subscription", authMiddleware, updateSubscription);

export default authRouter;
