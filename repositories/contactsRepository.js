import Contact from "./models/Contacts.js";

class ContactsRepository {
    async getAll(userId, filters = {}, limit, offset) {
        filters.owner = userId;
        return await Contact.findAll({
            where: filters,
            limit,
            offset,
        });
    }

    async getById(contactId, userId) {
        return await Contact.findOne({where: {id: contactId, owner: userId}});
    }

    async create({name, email, phone, owner}) {
        return await Contact.create({name, email, phone, owner});
    }

    async update(contactId, updatedData, userId) {
        const [rowsUpdated, [updatedContact]] = await Contact.update(updatedData, {
            where: {id: contactId, owner: userId},
            returning: true,
        });
        return rowsUpdated ? updatedContact : null;
    }

    async remove(contactId, userId) {
        const contact = await this.getById(contactId, userId);
        if (!contact) return null;
        await contact.destroy();
        return contact;
    }

    async updateFavorite(contactId, favoriteValue, userId) {
        const [rowsUpdated, [updatedContact]] = await Contact.update(
            {favorite: favoriteValue},
            {
                where: {id: contactId, owner: userId},
                returning: true,
            }
        );
        return rowsUpdated ? updatedContact : null;
    }
}

const contactsRepository = new ContactsRepository();
export default contactsRepository;
