import dotenv from "dotenv"
import mysql2 from 'mysql2'
dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
}

const connectionPool = mysql2.createPool(config)



export { config, connectionPool };
