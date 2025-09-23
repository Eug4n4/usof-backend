import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Comment extends Model {
    static #table = 'comments'
    constructor(args) {
        super(args)
        this.table = Comment.#table;
    }

    static async getById(id) {
        const [rows] = await connectionPool.promise().query(
            `select * from comments where comments.id = ?`,
            [id]
        )
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Comment(row);
    }

    static async getByPostId(id) {
        return [await connectionPool.promise().query(
            `select posts.title as post, posts.publish_date, users.full_name as author, comments.content,\ 
            comments.publish_date as comment_date from posts right join comments on comments.post_id = posts.id \
            inner join users on users.id = comments.author where posts.id = ?`,
            [id]
        )][0][0]
    }

    static async getByUserId(id) {
        const [rows] = await connectionPool.promise().query(`select * from comments where author = ? `, [id])
        return rows;
    }

    static async getByCommentUserId(commentId, userId) {
        const [rows] = await connectionPool.promise().query(`select * from comments where id = ? and author = ?`, [commentId, userId])
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Comment(row);
    }

    static get table() {
        return Comment.#table;
    }
}

export default Comment;