import {Sequelize} from "sequelize";

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.sequelize = new Sequelize("goitnode", "anton", "DNmdeMDfZ7SqtA2TcB9XIhBQ2pXfD7yN", {
            host: "dpg-culm82ggph6c73df16bg-a.virginia-postgres.render.com",
            port: 5432,
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: true
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
