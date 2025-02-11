import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?\d{7,15}$/).required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?\d{7,15}$/),
}).min(1);
