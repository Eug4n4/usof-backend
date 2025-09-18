import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Like extends Model {
    static #table = 'likes'
    constructor(args) {
        super(args);
        Model.table = Like.#table;
    }

    static async getByPostId(id) {
        return [await connectionPool.promise().query(
            `select posts.title, users.full_name as author, likes.type from likes \
            left join posts on posts.id = likes.post_id inner join users on users.id = likes.author \
            where posts.id = ?`,
            [id]
        )][0][0]
    }

    static async getByPostUserId(postId, userId) {
        const [rows] = await connectionPool.promise().query(
            `select posts.title, users.full_name as author, likes.type from likes \
            inner join posts on posts.id = likes.post_id \
            inner join users on users.id = likes.author where likes.post_id = ? and likes.author = ?`,
            [postId, userId]
        )
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Like(row);
    }

    static async getByCommentId(id) {
        return [await connectionPool.promise().query(

        )][0][0]
    }
}

export default Like;