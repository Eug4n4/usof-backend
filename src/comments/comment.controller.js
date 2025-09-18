import { matchedData } from "express-validator";
import Like from "../models/Like.js";


const createLike = (req, res) => {
    const { type } = matchedData(req);
    const comment_id = req.params['comment_id'];
    new Like({ comment_id: comment_id, author: req.user.id, type: type }).save();
    res.status(201);
    res.json({ 'message': 'Like created' })
}

export { createLike }