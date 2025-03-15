import {Sequelize} from "sequelize";

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.sequelize = new Sequelize("defaultdb", "avnadmin", "*", {
            host: "pg-goit-education-goit-education.c.aivencloud.com",
            port: 10568,
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false,
        });

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
