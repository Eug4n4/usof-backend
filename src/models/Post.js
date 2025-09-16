import Model from "./Model.js";
import { connectionPool } from "../db/db.js";
import User from "./User.js";

class Post extends Model {
	static #table = 'posts';
	constructor(args) {
		super(args);
		Model.table = Post.#table;
	}

	static async getAll() {
		return [await connectionPool.promise().query(
			`select users.full_name as author, posts.title as title, posts.content as content, categories.title as category \
			from ${Post.#table} left join ${User.table} on ${Post.#table}.author = ${User.table}.id \
			left join post_categories on ${Post.#table}.id = post_categories.post_id \ 
			left join categories on categories.id = post_categories.category_id;`,
		)][0][0]
	}

	static async getById(id) {
		return [await connectionPool.promise().query(
			`select users.full_name as author, posts.title, posts.content, categories.title as category \
			from posts inner join users on posts.author = users.id left join post_categories on \
			posts.id = post_categories.post_id left join categories on categories.id = post_categories.category_id \
			where posts.id = ?`, [id]
		)][0][0]
	}

	setCategories(categories) {

	}

	static get table() {
		return Post.#table;
	}
}

export default Post;