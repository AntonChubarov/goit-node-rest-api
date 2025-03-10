import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(), email: Joi.string().email().required(), phone: Joi.string()
        .pattern(/^\(?\+?[0-9]{1,4}\)?[-.\s]?\(?[0-9]{1,3}\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{4}$/)
        .required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\(?\+?[0-9]{1,4}\)?[-.\s]?\(?[0-9]{1,3}\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{4}$/),
}).min(1);

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});
