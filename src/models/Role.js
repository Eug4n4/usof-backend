import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Role extends Model {
    static #table = 'roles'
    constructor(args) {
        super(args);
        this.table = Role.#table
    }

    static async getByName(name) {
        const [rows] = await connectionPool.promise().query(`select id, name from roles where name = ?`, [name])
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Role(row);
    }

    static get table() {
        return Role.#table
    }
}

export default Role