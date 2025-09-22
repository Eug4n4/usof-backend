import { connectionPool } from "../db/db.js";
import Model from "./Model.js";

class PostCategories extends Model {
    static #table = 'post_categories'
    constructor(args) {
        super(args);
        Model.table = PostCategories.#table
    }

    async delete() {
        await connectionPool.promise().query(`delete from post_categories where post_id = ? and category_id = ?`,
            [this.post_id, this.category_id]
        )
    }
}

export default PostCategories;