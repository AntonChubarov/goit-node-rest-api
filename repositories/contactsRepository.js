import {DataTypes} from "sequelize";
import dbInstance from "../db/db.js";
import {User} from "./usersRepository.js";

const {sequelize} = dbInstance;

const Contact = sequelize.define("Contact", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    owner: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: "contacts",
    timestamps: false,
});

Contact.belongsTo(User, {foreignKey: "owner", onDelete: "CASCADE"});

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
export {Contact};
