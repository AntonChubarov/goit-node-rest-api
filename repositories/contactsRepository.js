import {DataTypes} from "sequelize";
import dbInstance from "../db/db.js";

const {sequelize} = dbInstance;

const Contact = sequelize.define("Contact", {
    id: {
        type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true,
    }, name: {
        type: DataTypes.STRING, allowNull: false,
    }, email: {
        type: DataTypes.STRING, allowNull: false,
    }, phone: {
        type: DataTypes.STRING, allowNull: false,
    }, favorite: {
        type: DataTypes.BOOLEAN, defaultValue: false,
    },
}, {
    tableName: "contacts", timestamps: false,
});

class ContactsRepository {
    async getAll() {
        return await Contact.findAll();
    }

    async getById(contactId) {
        return await Contact.findByPk(contactId);
    }

    async create({name, email, phone}) {
        return await Contact.create({name, email, phone});
    }

    async update(contactId, updatedData) {
        const [rowsUpdated, [updatedContact]] = await Contact.update(updatedData, {
            where: {id: contactId}, returning: true,
        });
        return rowsUpdated ? updatedContact : null;
    }

    async remove(contactId) {
        const contact = await this.getById(contactId);
        if (!contact) return null;
        await contact.destroy();
        return contact;
    }

    async updateFavorite(contactId, favoriteValue) {
        const [rowsUpdated, [updatedContact]] = await Contact.update({favorite: favoriteValue}, {
            where: {id: contactId}, returning: true
        });
        return rowsUpdated ? updatedContact : null;
    }
}

const contactsRepository = new ContactsRepository();
export default contactsRepository;
