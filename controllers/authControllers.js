import authService from "../services/authServices.js";
import validateBody from "../helpers/validateBody.js";
import {authSchema} from "../schemas/authSchemas.js";

export const register = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await authService.registerUser(email, password);
        res.status(201).json({user});
    } catch (error) {
        if (error.status === 409) {
            console.log(`[AUTH] Attempt to register with existing email: ${req.body.email}`);
        }

        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        validateBody(authSchema)(req, res, async () => {
            const {email, password} = req.body;
            const result = await authService.loginUser(email, password);
            res.status(200).json(result);
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logoutUser(req.user.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const {subscription} = req.body;
        const userId = req.user.id;

        const updatedUser = await authService.updateUserSubscription(userId, subscription);

        res.status(200).json({
            email: updatedUser.email,
            subscription: updatedUser.subscription,
        });
    } catch (error) {
        next(error);
    }
};
