import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Category extends Model {
    static #table = 'categories';

    constructor(args) {
        super(args);
        Model.table = Category.#table;
    }

    static async getAll() {
        return [await connectionPool.promise().query(`SELECT title from ${Category.#table}`)][0][0];
    }

    static async getByNames(names) {
        if (!names.length) {
            return [];
        }
        let template = `?,`.repeat(names.length);
        template = template.slice(0, template.length - 1);

        return [await connectionPool.promise().query(`SELECT id, title from ${Category.#table} where title in (${template})`, names)][0][0]
    }

    static async getById(id) {
        return [await connectionPool.promise().query(
            `SELECT id, title from ${Category.#table} where id = ?`,
            [id]
        )][0][0]
    }

    static async getRelatedPosts(id) {
        return [await connectionPool.promise().query(
            `select categories.title as category, posts.title, posts.content, posts.publish_date from categories \
			right join post_categories on category_id = categories.id \ 
			right join posts on posts.id = post_categories.post_id where categories.id = ?`,
            [id]
        )][0][0];
    }

    static get table() {
        return Category.#table;
    }
}

export default Category;