import Model from './Model.js'
import { connectionPool } from '../db/db.js';

class User extends Model {
    static #table = 'users';

    constructor(args) {
        super(args);
        Model.table = User.#table
    }

    static async findBy(field, value) {
        const [rows] = await connectionPool.promise().query(
            `SELECT * FROM users WHERE ${field} = ?`,
            [value]
        );
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new User(Object.assign({}, row));

    }

    static async getAll() {
        return [await connectionPool.promise().query(`SELECT id, login, email, full_name, photo, rating, role_id FROM ${User.#table}`)][0][0];
    }

    static async getById(id) {
        return [await connectionPool.promise().query(
            `SELECT id, login, email, full_name, photo, rating, role_id FROM ${User.#table}
			 WHERE id = ?`, [id])][0][0];
    }

    static get table() {
        return User.#table;
    }

}

export default User;