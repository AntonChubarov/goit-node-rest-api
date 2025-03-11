import jwt from "jsonwebtoken";
import authService from "../services/authServices.js";
import HttpError from "./HttpError.js";

import SECRET_KEY from "../config/config.js";

const authMiddleware = async (req, res, next) => {
    try {
        console.log("[AUTH] Middleware triggered");

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error("[AUTH] No authorization header provided");
            return next(HttpError(401, "Not authorized"));
        }

        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            console.error("[AUTH] Invalid authorization format:", authHeader);
            return next(HttpError(401, "Not authorized"));
        }

        console.log("[AUTH] Token received:", token);

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            console.error("[AUTH] JWT verification failed:", error.message);
            return next(HttpError(401, "Invalid or expired token"));
        }

        console.log("[AUTH] Token decoded:", decoded);

        const user = await authService.getCurrentUser(decoded.id);
        if (!user) {
            console.error("[AUTH] User not found in database:", decoded.id);
            return next(HttpError(401, "Not authorized"));
        }

        if (user.token !== token) {
            console.error("[AUTH] Token mismatch for user:", user.email, "Expected:", user.token, "Received:", token);
            return next(HttpError(401, "Token does not match active session"));
        }

        console.log("[AUTH] User authenticated successfully:", user.email);

        req.user = {
            id: user.id,
            email: user.email,
            subscription: user.subscription,
        };

        next();
    } catch (error) {
        console.error("[AUTH] Middleware error:", error.message);
        return next(HttpError(401, "Invalid or expired token"));
    }
};

export default authMiddleware;
