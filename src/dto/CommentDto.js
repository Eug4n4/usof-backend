class CommentDto {
    id
    author
    content
    publish_date
    status
    constructor(comment, login) {
        this.id = comment.id;
        this.content = comment.content;
        this.status = comment.status;
        this.publish_date = comment.publish_date;
        this.author = login;
    }

    static async createInstance(comment) {
        const login = await comment.getAuthorLogin()
        return new CommentDto(comment, login)
    }
}

export default CommentDto;