import { SortAscending, SortDescending } from "../db/QuerySort.js";
class PostSortStrategy {

    static get(fieldName, order) {
        if (fieldName == undefined) {
            fieldName = "likes";
        }
        if (order == undefined) {
            order = "desc";
        }
        return SortContext.strategy.get(PostSortStrategy)[order][fieldName];

    }

}

class CommentSortStrategy {
    static get(fieldName, order) {
        if (fieldName == undefined) {
            fieldName = "likes";
        }
        if (order == undefined) {
            order = "asc";
        }
        return SortContext.strategy.get(CommentSortStrategy)[order][fieldName];
    }
}


class SortContext {
    static strategy = new Map();
    static {
        this.strategy.set(PostSortStrategy, {
            "desc": {
                "likes": new SortDescending("likes"),
                "dislikes": new SortDescending("dislikes"),
                "date": new SortDescending("posts.publish_date")
            },
            "asc": {
                "likes": new SortAscending("likes"),
                "dislikes": new SortAscending("dislikes"),
                "date": new SortAscending("posts.publish_date")
            }


        })
        this.strategy.set(CommentSortStrategy, {
            "desc": {
                "likes": new SortDescending("likes"),
                "dislikes": new SortDescending("dislikes"),
                "date": new SortDescending("comment_date")
            },
            "asc": {
                "likes": new SortAscending("likes"),
                "dislikes": new SortAscending("dislikes"),
                "date": new SortAscending("comment_date")
            }

        })
    }

}




export { PostSortStrategy, CommentSortStrategy }