import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Category extends Model {
    static #table = 'categories';

    constructor(args) {
        super(args);
        this.table = Category.#table;
    }

    static async getAll() {
        return [await connectionPool.promise().query(`SELECT * from ${Category.#table}`)][0][0];
    }

    static async getByNames(names) {
        if (!names.length) {
            return [];
        }
        let template = `?,`.repeat(names.length);
        template = template.slice(0, template.length - 1);

        return [await connectionPool.promise().query(`SELECT * from ${Category.#table} where title in (${template})`, names)][0][0]
    }

    static async getById(id) {
        const [rows] = await connectionPool.promise().query(
            `SELECT * from ${Category.#table} where id = ?`, [id]);
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Category(row);
    }

    static async getByPostId(id) {
        return [await connectionPool.promise().query(
            `select posts.title, posts.publish_date, categories.title as category, categories.id as category_id from posts \
            inner join post_categories on posts.id = post_categories.post_id \
            right join categories on categories.id = post_categories.category_id where posts.id = ?`,
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