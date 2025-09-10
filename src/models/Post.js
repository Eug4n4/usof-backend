import Model from "./Model.js";
import { connectionPool } from "../db/db.js";
import User from "./User.js";

class Post extends Model {
	static #table = 'posts';


	static async getAll() {
		return [await connectionPool.promise().query(
			`select users.full_name as author, posts.title as title, posts.content as content, categories.title as category_name \
			from ${this.table} left join ${User.table} on ${this.table}.author = ${User.table}.id \
			left join post_categories on ${this.table}.id = post_categories.post_id \ 
			left join categories on categories.id = post_categories.category_id;`,
		)][0][0]
	}

	static get table() {
		return Post.#table;
	}
}

export default Post;