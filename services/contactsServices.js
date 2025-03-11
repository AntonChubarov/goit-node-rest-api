import contactsRepository from "../repositories/contactsRepository.js";

export async function listContacts(userId, page, limit, filters) {
    const offset = (page - 1) * limit;
    return await contactsRepository.getAll(userId, filters, limit, offset);
}

export async function getContactById(userId, contactId) {
    return await contactsRepository.getById(contactId, userId);
}

export async function addContact(userId, name, email, phone) {
    return await contactsRepository.create({name, email, phone, owner: userId});
}

export async function updateContact(userId, contactId, updatedData) {
    return await contactsRepository.update(contactId, updatedData, userId);
}

export async function removeContact(userId, contactId) {
    return await contactsRepository.remove(contactId, userId);
}

export async function updateStatusContact(userId, contactId, favoriteValue) {
    return await contactsRepository.updateFavorite(contactId, favoriteValue, userId);
}
