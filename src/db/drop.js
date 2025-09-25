import mysql2 from 'mysql2/promise.js'
import { config } from './db.js';


const dropDB = async (name) => {
    let conn;
    try {
        conn = await mysql2.createConnection(config)
    } catch (e) {
        console.error(e.message);
        return;
    }
    const dbName = mysql2.escapeId(name)
    try {
        await conn.query(`drop database if exists ${dbName}`)
        console.log(`Dropped database ${name}`)
    } catch (e) {
        console.error(e.message)
    } finally {
        await conn.end()
    }
}

dropDB(process.env.DATABASE);
