import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class Favorite extends Model {
    static #table = 'favorites'
    constructor(args) {
        super(args);
        this.table = Favorite.#table;
    }

    static async getCount(query, queryValues) {
        const [rows] = await connectionPool.promise().query(`select count(*) as total ${query}`, [queryValues])
        const row = rows[0]
        return row;
    }

    static async getFilteredAndCount(options, queryValues) {
        const fields = 'select full_name as author, favorites.post_id as id, posts.title, posts.content, posts.publish_date, posts.is_active, COALESCE(JSON_ARRAYAGG(JSON_OBJECT("id",categories.id, "title", categories.title)),JSON_ARRAY()) AS categories, \
        coalesce(likes.likes,0) as likes, coalesce(likes.dislikes, 0) as dislikes';
        let filteredQuery = `from favorites inner join posts on posts.id = favorites.post_id \
        inner join users on users.id = posts.author left join post_categories on posts.id = post_categories.post_id \ 
			left join categories on categories.id = post_categories.category_id \
            left join (select post_id, sum(type = 1) as likes, sum(type = 0) as dislikes from likes \
        where post_id is not null group by post_id) as likes on likes.post_id = favorites.post_id`
        if (options['filter']) {
            filteredQuery += ' where '
            filteredQuery = options['filter'].apply(filteredQuery);
        }
        const count = await Favorite.getCount(filteredQuery, queryValues);
        filteredQuery += ' group by favorites.post_id, users.full_name, likes.likes, likes.dislikes '
        if (options['sort']) {
            filteredQuery += 'order by '
            filteredQuery = options['sort'].apply(filteredQuery);
        }
        filteredQuery += ' limit ?,?';
        const query = `${fields} ${filteredQuery}`
        queryValues.push(options['offset']);
        queryValues.push(options['pageSize']);
        return { count: count.total, data: [await connectionPool.promise().query(query, queryValues)][0][0] }
    }

    static async getByUserId(options, queryValues) {
        return Favorite.getFilteredAndCount(options, queryValues);

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