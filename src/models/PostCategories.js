import Model from "./Model.js";

class PostCategories extends Model {
    static #table = 'post_categories'
    constructor(args) {
        super(args);
        Model.table = PostCategories.#table
    }
}

export default PostCategories;