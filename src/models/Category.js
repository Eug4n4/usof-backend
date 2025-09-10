import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Category extends Model {
	static #table = 'categories';

	static async getAll() {
		return [await connectionPool.promise().query(`SELECT ${this.#table}.title as category_name from ${this.#table}`)][0][0];
	}

	static get table() {
		return Category.#table;
	}
}

export default Category;