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
            "select comments.* from comments where comments.id = ?", [id])
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Comment(row);
    }

    static async getPostCommentCount(postId) {
        const [rows] = await connectionPool.promise().query('select count(*) as total from comments where post_id = ?', [postId]);
        const row = rows[0];
        return row;
    }

    static async getByPostId(options) {
        let query = "select comments.id, users.login as author, comments.content, comments.is_active as status, comments.publish_date, coalesce(likes.likes, 0) as likes, coalesce(likes.dislikes, 0) as dislikes \
        from posts right join comments on comments.post_id = posts.id inner join users on users.id = comments.author \
        left join (select comment_id, sum(type = 1) as likes, sum(type = 0) as dislikes from likes where comment_id is not null group by comment_id) \
        as likes on likes.comment_id = comments.id";
        if (options['filter']) {
            query += ' where '
            query = options['filter'].apply(query)
        }
        if (options['sort']) {
            query += ' order by ';
            query = options['sort'].apply(query);
        }
        query += ` limit ?,?`;
        return [await connectionPool.promise().query(query, [options['offset'], options['pageSize']])][0][0]
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

    async getAuthorLogin() {
        const [rows] = await connectionPool.promise().query(`select login from users join comments on comments.author = users.id where comments.author = ? and comments.id = ?`, [this.author, this.id])
        const row = rows[0];
        if (!row) {
            return null;
        }
        return row.login;
    }
}

export default Comment;