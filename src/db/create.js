import mysql2 from 'mysql2/promise'
import { config } from './db.js';
import fs from 'fs'


const createDB = async (name) => {

    let conn;
    try {
        conn = await mysql2.createConnection({ ...config })
        console.log('Database already exists')
    } catch (e) {
        conn = await mysql2.createConnection({ ...config, multipleStatements: true, database: undefined })
        const dbName = mysql2.escapeId(name);
        await conn.query(`create database if not exists ${dbName}`)
        await conn.query(`use ${dbName}`)
        const queries = fs.readFileSync('src/db/tables.sql', { encoding: 'utf-8' })
        await conn.query(queries)
        const triggers = fs.readFileSync('src/db/triggers.sql', { encoding: 'utf-8' })
        await conn.query(triggers)
        const seed = fs.readFileSync('src/db/seed.sql', { encoding: 'utf-8' })
        await conn.query(seed)
        console.log(`Created database ${name}`)
    }
    await conn.end()
}

createDB(process.env.DATABASE);