import Model from './Model.js'
import { connectionPool } from '../db/db.js';

class User extends Model {
	static #table = 'users';

	static get table() {
		return User.#table;
	}


	static async getAll() {
		return [await connectionPool.promise().query(`SELECT id, login, email, full_name, photo, rating, role_id FROM ${this.table}`)][0][0];
	}

}

export default User;