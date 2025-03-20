import {
    addContact,
    getContactById,
    listContacts,
    removeContact,
    updateContact,
    updateStatusContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const {page = "1", limit = "20", favorite} = req.query;
        const userId = req.user.id;

        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        const filters = {};
        if (favorite !== undefined) {
            filters.favorite = favorite === "true";
        }

        const contacts = await listContacts(userId, parsedPage, parsedLimit, filters);

        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const contact = await getContactById(userId, id);
        if (!contact) {
            return next(HttpError(404, "Not found"));
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const {name, email, phone} = req.body;
        const userId = req.user.id;

        const newContact = await addContact(userId, name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

export const updateContactController = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return next(HttpError(400, "Body must have at least one field"));
        }
        const {id} = req.params;
        const userId = req.user.id;

        const updatedContact = await updateContact(userId, id, req.body);
        if (!updatedContact) {
            return next(HttpError(404, "Not found"));
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;

        const removedContact = await removeContact(userId, id);
        if (!removedContact) {
            return next(HttpError(404, "Not found"));
        }
        res.status(200).json(removedContact);
    } catch (error) {
        next(error);
    }
};

export const updateFavoriteController = async (req, res, next) => {
    try {
        const {contactId} = req.params;
        const {favorite} = req.body;
        const userId = req.user.id;

        if (typeof favorite !== "boolean") {
            return next(HttpError(400, "Missing field favorite"));
        }

        const updatedContact = await updateStatusContact(userId, contactId, favorite);
        if (!updatedContact) {
            return next(HttpError(404, "Not found"));
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        next(error);
    }
};
