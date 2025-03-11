import express from "express";
import {
    createContact,
    deleteContact,
    getAllContacts,
    getOneContact,
    updateContactController,
    updateFavoriteController,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {createContactSchema, updateContactSchema, updateFavoriteSchema,} from "../schemas/contactsSchemas.js";
import authMiddleware from "../helpers/authMiddleware.js";

const contactsRouter = express.Router();

contactsRouter.use(authMiddleware);

contactsRouter.get("/", getAllContacts);
contactsRouter.get("/:id", getOneContact);
contactsRouter.post("/", validateBody(createContactSchema), createContact);
contactsRouter.put("/:id", validateBody(updateContactSchema), updateContactController);
contactsRouter.delete("/:id", deleteContact);
contactsRouter.patch("/:contactId/favorite", validateBody(updateFavoriteSchema), updateFavoriteController);

export default contactsRouter;
