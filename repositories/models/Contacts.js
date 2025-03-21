import dbInstance from "../../db/db.js";
import {DataTypes} from "sequelize";
import User from "./Users.js";

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

export default Contact;
