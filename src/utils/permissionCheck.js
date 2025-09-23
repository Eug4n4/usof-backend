import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const mustBePostCreator = async (req, res, next) => {
    const post = await Post.getByPostAuthorId(req.params['post_id'], req.user['id'])
    if (post) {
        next();
    } else {
        res.status(403)
        res.json({ 'message': 'You don\'t have access to update this resource' })
    }
}

const mustBeAdmin = (req, res, next) => {
    if (req.user['role'] === 'admin') {
        next()
    } else {
        res.status(403)
        res.json({ 'message': 'You don\'t have access to update this resource' })
    }

}

const mustBeAdminOrSelf = (req, res, next) => {
    if (req.user['role'] === 'admin' || req.params['user_id'] == req.user['id']) {
        next()
    } else {
        res.status(403)
        res.json({ 'message': 'You don\'t have access to update this resource' })
    }
}

export { mustBePostCreator, mustBeAdmin, mustBeAdminOrSelf };