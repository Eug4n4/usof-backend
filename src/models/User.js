import Model from './Model.js'
import { connectionPool } from '../db/db.js';

class User extends Model {
    static #table = 'users';

    constructor(args) {
        super(args);
        Model.table = User.#table
    }

    async getRole() {
        const [rows] = await connectionPool.promise().query(`SELECT name as role from roles inner join users on roles.id = users.role_id where users.id = ?`, [this.id])
        const row = rows[0];
        if (!row) {
            return null;
        }
        return row;
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
        return [await connectionPool.promise().query(`SELECT users.id, login, email, full_name, photo, rating, roles.name as role \
             FROM ${User.#table} INNER JOIN roles on roles.id = users.role_id`)][0][0];
    }

    static async getById(id) {
        const [rows] = await connectionPool.promise().query(
            `SELECT id, login, email, full_name, photo, rating, role_id FROM ${User.#table}
			 WHERE id = ?`, [id]);
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new User(Object.assign({}, row));
    }

    static async getByEmail(email) {
        const [rows] = await connectionPool.promise().query(
            `SELECT id, login, email, full_name, photo, rating, is_active, role_id FROM users where email = ?`, [email]
        );
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new User(Object.assign({}, row));
    }

    static get table() {
        return User.#table;
    }

}

export default User;