import {Sequelize} from "sequelize";


import {DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER} from "../config/config.js";


class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.sequelize = new Sequelize(
            DB_NAME,
            DB_USER,
            DB_PASSWORD,
            {
                host: DB_HOST,
                port: DB_PORT,
                dialect: "postgres",
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                logging: false,
            }
        );

        this._connect();
        Database.instance = this;
        Object.freeze(this);
    }

    async _connect() {
        try {
            await this.sequelize.authenticate();
            console.log("Database connection successful");
        } catch (error) {
            console.error("Database connection error:", error.message);
            process.exit(1);
        }
    }
}

const dbInstance = new Database();
export default dbInstance;
export const sequelize = dbInstance.sequelize;
