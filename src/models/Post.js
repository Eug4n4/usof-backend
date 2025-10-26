import Model from "./Model.js";
import { connectionPool } from "../db/db.js";
import User from "./User.js";
import PostCategories from "./PostCategories.js";
import Category from "./Category.js";

class Post extends Model {
    static #table = 'posts';
    constructor(args) {
        super(args);
        this.table = Post.#table;
    }

    static async getCount(query, queryValues) {
        const [rows] = await connectionPool.promise().query(`select count(distinct(posts.id)) as total ${query}`, queryValues);
        const row = rows[0];
        return row;
    }

    static async getAuthorCount(authorId) {
        const [rows] = await connectionPool.promise().query('select count(*) as total from posts where author = ?', [authorId]);
        const row = rows[0];
        return row;
    }

    static async getFilteredAndCount(options, queryValues) {
        const fields = 'select posts.title,posts.id, posts.content, posts.publish_date, posts.is_active, COALESCE(JSON_ARRAYAGG(JSON_OBJECT("id",categories.id, "title", categories.title)),JSON_ARRAY()) AS categories, \
            users.login as author, users.photo, COALESCE(MAX(likes.likes), 0) AS likes,\
            COALESCE(MAX(likes.dislikes), 0) AS dislikes';
        let filteredQuery = `FROM posts \
            inner join users on posts.author = users.id \
            LEFT JOIN post_categories ON posts.id = post_categories.post_id \
            LEFT JOIN categories ON categories.id = post_categories.category_id \
            LEFT JOIN (SELECT post_id, SUM(type = 1) AS likes, SUM(type = 0) AS dislikes FROM likes GROUP BY post_id) \
            likes ON likes.post_id = posts.id`
        if (options['filter']) {
            filteredQuery += ' where '
            filteredQuery = options['filter'].apply(filteredQuery);
        }
        const count = await Post.getCount(filteredQuery, queryValues);
        filteredQuery += ' group by posts.id '
        if (options['sort']) {
            filteredQuery += 'order by '
            filteredQuery = options['sort'].apply(filteredQuery);
        }
        filteredQuery += ' limit ?,?';
        const query = `${fields} ${filteredQuery}`
        queryValues = queryValues.filter(value => value != undefined);
        queryValues.push(options['offset']);
        queryValues.push(options['pageSize']);
        return { count: count.total, data: [await connectionPool.promise().query(query, queryValues)][0][0] }
    }

    static async getAll(options, queryValues) {
        return Post.getFilteredAndCount(options, queryValues)

    }

    static async getById(id) {
        const [rows] = await connectionPool.promise().query(
            `select posts.id, posts.title, posts.content, posts.publish_date, posts.is_active, COALESCE(JSON_ARRAYAGG(JSON_OBJECT("id",categories.id, "title", categories.title)),JSON_ARRAY()) AS categories, \
            users.login as author, users.photo, COALESCE(MAX(likes.likes), 0) AS likes,\
            COALESCE(MAX(likes.dislikes), 0) AS dislikes from posts \
            inner join users on posts.author = users.id \
			left join post_categories on posts.id = post_categories.post_id \ 
			left join categories on categories.id = post_categories.category_id \
            LEFT JOIN (SELECT post_id, SUM(type = 1) AS likes, SUM(type = 0) AS dislikes FROM likes GROUP BY post_id) \
            likes on likes.post_id = posts.id \
            where posts.id = ? group by posts.id order by likes desc`, [id]
        )
        const row = rows[0];
        return row;
    }

    static async getByAuthorId(options, queryValues) {
        return Post.getFilteredAndCount(options, queryValues)

    }

    static async getByPostAuthorId(postId, authorId) {
        const [rows] = await connectionPool.promise().query(
            `select posts.title, posts.publish_date, posts.is_active, COALESCE(JSON_ARRAYAGG(JSON_OBJECT("id",categories.id, "title", categories.title)),JSON_ARRAY()) AS categories, \
            users.login as author, users.photo, COALESCE(MAX(likes.likes), 0) AS likes,\
            COALESCE(MAX(likes.dislikes), 0) AS dislikes from posts \
            inner join users on posts.author = users.id \
			left join post_categories on posts.id = post_categories.post_id \ 
			left join categories on categories.id = post_categories.category_id \
            LEFT JOIN (SELECT post_id, SUM(type = 1) AS likes, SUM(type = 0) AS dislikes FROM likes GROUP BY post_id) \
            likes on likes.post_id = posts.id \
            where posts.id = ? and posts.author = ? group by posts.id order by likes desc`, [postId, authorId]
        )
        const row = rows[0];
        return row;
    }

    setCategories(categories) {
        for (const category of categories) {
            new PostCategories({ post_id: this.id, category_id: category.id }).save()
        }
    }

    async deleteCategories() {
        const categories = await Category.getByPostId(this.id)
        for (const cat of categories) {
            await new PostCategories({ post_id: this.id, category_id: cat['category_id'] }).delete()
        }
    }

    static get table() {
        return Post.#table;
    }
}

export default Post;