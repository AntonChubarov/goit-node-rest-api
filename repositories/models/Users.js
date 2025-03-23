import {DataTypes} from "sequelize";
import dbInstance from "../../db/db.js";

const {sequelize} = dbInstance;

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatarURL: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "avatar_url",
    },
    subscription: {
        type: DataTypes.ENUM,
        values: ["starter", "pro", "business"],
        defaultValue: "starter",
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verificationToken: {
        type: DataTypes.STRING,
        defaultValue: null,
        field: "verification_token",
    },
}, {
    tableName: "users",
    timestamps: false,
});

export default User;
