import contactsRepository from "../repositories/contactsRepository.js";

export async function listContacts() {
    return await contactsRepository.getAll();
}

export async function getContactById(contactId) {
    return await contactsRepository.getById(contactId);
}

export async function addContact(name, email, phone) {
    return await contactsRepository.create({name, email, phone});
}

export async function updateContact(contactId, updatedData) {
    return await contactsRepository.update(contactId, updatedData);
}

export async function removeContact(contactId) {
    return await contactsRepository.remove(contactId);
}

export async function updateStatusContact(contactId, favoriteValue) {
    return await contactsRepository.updateFavorite(contactId, favoriteValue);
}
