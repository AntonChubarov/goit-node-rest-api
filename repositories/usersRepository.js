import {DataTypes} from "sequelize";
import dbInstance from "../db/db.js";

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
    subscription: {
        type: DataTypes.ENUM,
        values: ["starter", "pro", "business"],
        defaultValue: "starter",
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
}, {
    tableName: "users",
    timestamps: false,
});

class UsersRepository {
    async create({email, password}) {
        try {
            return await User.create({email, password});
        } catch (error) {
            console.error(`[DB] Error creating user ${email}:`, error);
            throw error;
        }
    }

    async findByEmail(email) {
        return await User.findOne({where: {email}});
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async updateToken(userId, token) {
        console.log(`[DB] Updating token for user ${userId}: ${token}`);
        const [rowsUpdated] = await User.update(
            {token},
            {where: {id: userId}}
        );

        if (rowsUpdated === 0) {
            console.error(`[DB] Failed to update token for user ${userId}`);
        }
    }

    async updateSubscription(userId, subscription) {
        const [rowsUpdated, [updatedUser]] = await User.update(
            {subscription},
            {where: {id: userId}, returning: true}
        );
        return rowsUpdated ? updatedUser : null;
    }
}

const usersRepository = new UsersRepository();
export default usersRepository;
export {User};
