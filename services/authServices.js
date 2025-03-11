import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usersRepository from "../repositories/usersRepository.js";
import HttpError from "../helpers/HttpError.js";

import SECRET_KEY from "../config/config.js";

const validSubscriptions = ["starter", "pro", "business"];

class AuthService {
    async registerUser(email, password) {
        const existingUser = await usersRepository.findByEmail(email);
        if (existingUser) {
            console.warn(`[AUTH] Registration failed: Email already in use (${email})`);
            return Promise.reject(HttpError(409, "Email in use"));
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await usersRepository.create({email, password: hashedPassword});

            return {
                email: newUser.email,
                subscription: newUser.subscription,
            };
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError" || error.parent?.code === "23505") {
                console.error(`[AUTH] Database constraint error: ${email} is already registered.`);
                return Promise.reject(HttpError(409, "Email in use"));
            }

            console.error("[AUTH] Unexpected registration error:", error);
            return Promise.reject(HttpError(500, "Internal server error"));
        }
    }

    async loginUser(email, password) {
        const user = await usersRepository.findByEmail(email);
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw HttpError(401, "Email or password is wrong");
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1h"});

        console.log(`[AUTH SERVICE] Storing token for user ${user.email}: ${token}`);

        await usersRepository.updateToken(user.id, token);

        return {
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        };
    }

    async logoutUser(userId) {
        const user = await usersRepository.findById(userId);
        if (!user) {
            throw HttpError(401, "Not authorized");
        }
        await usersRepository.updateToken(userId, null);
    }

    async getCurrentUser(userId) {
        console.log(`[AUTH SERVICE] Fetching user with ID: ${userId}`);
        const user = await usersRepository.findById(userId);

        if (!user) {
            console.warn(`[AUTH SERVICE] User not found: ${userId}`);
            return null;
        }

        console.log(`[AUTH SERVICE] Found user: ${user.email}, Token in DB: ${user.token}`);
        return user;
    }

    async updateUserSubscription(userId, subscription) {
        if (!validSubscriptions.includes(subscription)) {
            throw HttpError(400, "Invalid subscription value");
        }

        const user = await usersRepository.updateSubscription(userId, subscription);
        if (!user) {
            throw HttpError(404, "User not found");
        }

        return user;
    }
}

const authService = new AuthService();
export default authService;
