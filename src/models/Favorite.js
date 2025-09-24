import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Favorite extends Model {
    static #table = 'favorites'
    constructor(args) {
        super(args);
        this.table = Favorite.#table;
    }

    static async getByUserId(id) {
        const [rows] = await connectionPool.promise().query(`
            select post_id, user_id, title from favorites \
            inner join posts on posts.id = favorites.post_id where favorites.user_id = ?`, [id])
        return rows;
    }

    static async getByPostUserId(postId, userId) {
        const [rows] = await connectionPool.promise().query(`select * from favorites where post_id = ? and user_id = ?`, [postId, userId])
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Favorite(row);
    }

    async delete() {
        if (this.post_id && this.user_id) {
            await connectionPool.promise().query(`delete from favorites where post_id = ? and user_id = ?`, [this.post_id, this.user_id])
        }
    }
}

export default Favorite;