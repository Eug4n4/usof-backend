import Post from "../models/Post.js";

const mustBeCreator = async (req, res, next) => {
    const post = await Post.getByPostAuthorId(req.params['post_id'], req.user['id'])
    if (post) {
        next();
    } else {
        res.status(403)
        res.json({ 'message': 'You don\'t have access to update this resource' })
    }
}

const mustBeAdmin = async (req, res, next) => {
    if (req.user['role'] === 'admin') {
        next()
    } else {
        res.status(403)
        res.json({ 'message': 'You don\'t have access to update this resource' })
    }

}

export { mustBeCreator, mustBeAdmin };