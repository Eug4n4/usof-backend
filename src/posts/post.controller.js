import { matchedData, validationResult } from "express-validator";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import User from "../models/User.js"
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import getAuthUserData from "../auth/getAuthUserData.js";
import { CategoryFilter, DateFilter, FieldFilter, RoleFilter } from "../db/QueryFilter.js";
import Favorite from "../models/Favorite.js";
import { CommentSortStrategy, PostSortStrategy } from "../strategies/SortStrategy.js";

// const getFilterStrategy = (categoriesLength, startInterval, endInterval, status, role) => {

//     let result
//     if (role) {
//         result = new RoleFilter(role, result)
//     } else {
//         result = new RoleFilter(undefined, result);
//     }
//     if (status == 1 || status == 0) {
//         result = new FieldFilter('posts.is_active', status, result)
//     }
//     if (startInterval && endInterval) {
//         result = new DateFilter('posts.publish_date', startInterval, endInterval, result)
//     }
//     if (categoriesLength > 0) {
//         result = new CategoryFilter('categories.title', categoriesLength, result);

//     }

//     return result;
// }

export const getFilterStrategy = (fields) => {
    let result
    for (const field of fields) {
        switch (field.name) {
            case "id": {
                result = new FieldFilter(field.value.field, field.value.value, result);
                break;
            }
            case "date": {
                const from = field.value.value.from;
                const to = field.value.value.to;
                if (from && to) {
                    result = new DateFilter(field.value.field, field.value.value.from, field.value.value.to, result)
                }
                break;
            }
            case "status": {
                if (field.value.value) {
                    result = new FieldFilter(field.value.field, field.value.value, result)
                }
                break;
            }
            case "categories":
                for (const cat of field.value) {
                    result = new FieldFilter("categories.title", cat, result)
                }
                break;
            case "role":
                result = new RoleFilter(field.value, result)
                break;
            default:
                break;
        }
    }
    return result;
}

const getAll = async (req, res) => {
    const { access, refresh } = req.cookies;
    const userData = getAuthUserData(access, refresh);
    let { sort, order, category, startDate, endDate, status, page, pageSize } = req.query;
    page = Number(page);
    pageSize = Number(pageSize);

    if (isNaN(page) || page < 1) {
        page = 1;
    }
    if (isNaN(pageSize) || pageSize < 1) {
        pageSize = 5;
    }
    const offset = (page - 1) * pageSize
    if (status === 'active') {
        status = 1;
    } else if (status === 'inactive') {
        status = 0;
    }
    const sortingStrategy = PostSortStrategy.get(sort, order);
    const filterOptions = [];
    const queryValues = [];
    if (Array.isArray(category)) {
        queryValues.push(...category)
    } else {
        queryValues.push(...[category].filter(Boolean))
    }
    filterOptions.push({ name: "role", value: userData?.role })
    filterOptions.push({ name: "status", value: { field: "posts.is_active", value: status } })
    filterOptions.push({ name: "date", value: { field: "posts.publish_date", value: { from: startDate, to: endDate } } })
    filterOptions.push({ name: "categories", value: queryValues })

    let filterStrategy = getFilterStrategy(filterOptions);

    let posts;
    if (userData?.role === 'admin' || userData == undefined) {
        posts = await Post.getAll({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset }, queryValues)
    } else if (userData?.role === 'user') {
        queryValues.push(userData.id)
        posts = await Post.getAll({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset }, queryValues)
    }
    const totalPosts = await Post.getCount();
    let nextUrl;
    let previousUrl;
    if (req.url.match(/page=[^&]*/g) != null) {
        if (page > 1) {
            previousUrl = req.url.replaceAll(/page=[^&]*/g, `page=${page - 1}`)
        }
        nextUrl = req.url.replaceAll(/page=[^&]*/g, `page=${page + 1}`);
    } else {
        nextUrl = req.url + `&page=${page + 1}`
    }
    if (previousUrl) {
        res.json({
            'page': `${req.host}${req.baseUrl}${req.url}`,
            'next': `${req.host}${req.baseUrl}${nextUrl}`,
            'prev': `${req.host}${req.baseUrl}${previousUrl}`,
            'total': totalPosts.total,
            'data': posts
        })
    } else {
        res.json({
            'page': `${req.host}${req.baseUrl}${req.url}`,
            'next': `${req.host}${req.baseUrl}${nextUrl}`,
            'total': totalPosts.total,
            'data': posts
        })
    }

}

const getOne = async (req, res) => {
    const id = Number.parseInt(req.params['post_id']);
    if (id) {
        const result = await Post.getById(id);
        res.json(result);
    } else {
        res.status(400);
        res.json({ 'message': 'Provide correct post_id' });
    }
}

const createOne = async (req, res) => {
    const { title, content, categories } = matchedData(req);
    const createdCategories = await Category.getByNames(categories);
    const { id } = await User.findBy('id', req.user['id']);
    if (createdCategories.length === categories.length) {
        const newPost = new Post({ author: id, title, content });
        newPost.save().then(() => {
            newPost.setCategories(createdCategories)
        })
        res.json(newPost);
    } else {
        res.status(400);
        res.json({ 'message': 'Some category didn\'t exist' })
    }

}

const createLike = async (req, res) => {
    const { type } = matchedData(req);
    const postId = req.params['post_id'];
    new Like({ post_id: postId, author: req.user.id, type: type }).save();
    res.status(201);
    if (type == 1) {
        res.json({ 'message': 'Like created' })
    } else {
        res.json({ 'message': 'Dislike created' })
    }
}

const createComment = async (req, res) => {
    const { content } = matchedData(req);
    const postId = req.params['post_id'];
    const comment = new Comment({ author: req.user.id, post_id: postId, content: content });
    try {
        await comment.save()
        const responseData = await Comment.getById(comment.id);
        res.status(201).json({ data: responseData });
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ "message": "Failed to save comment" })
    }
}

const getComments = async (req, res) => {
    const postId = req.params['post_id']
    let { sort, order, status, page, pageSize } = req.query;
    page = Number(page);
    pageSize = Number(pageSize);
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    if (isNaN(pageSize) || pageSize < 1) {
        pageSize = 5;
    }
    const offset = (page - 1) * pageSize
    if (status === 'active') {
        status = 1;
    } else if (status === 'inactive') {
        status = 0;
    }
    const filterOptions = [];
    filterOptions.push({ name: "id", value: { field: "posts.id", value: postId } })
    const sortingStrategy = CommentSortStrategy.get(sort, order);
    const filterStrategy = getFilterStrategy(filterOptions);
    try {
        const comments = await Comment.getByPostId({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset })
        const count = await Comment.getPostCommentCount(postId);
        return res.json({ total: count.total, data: comments })
    } catch {
        return res.status(404).json({ "message": "I cant find this" })

    }
}

const addToFavorite = async (req, res) => {
    const id = req.params['post_id'];
    const post = await Post.getById(id)
    if (post) {
        let favorite = await Favorite.getByPostUserId(id, req.user['id'])
        if (!favorite) {
            favorite = new Favorite({ post_id: id, user_id: req.user['id'] })
            favorite.save();
            res.json(favorite)
        } else {
            res.status(400).json({ 'message': 'You have already added this post to your favorites' })
        }
    } else {
        res.status(400);
        res.json({ 'message': 'Cannot find post' })
    }
}

const updatePost = async (req, res) => {
    const postId = req.params['post_id'];
    const { title, content, categories } = matchedData(req);
    const newCategories = await Category.getByNames(categories)
    if (newCategories.length === categories.length) {
        const post = new Post({ id: postId, title: title, content: content })
        post.save();
        await post.deleteCategories()
        post.setCategories(newCategories);

        res.json({ 'message': 'Updated successfully' })
    } else {
        res.status(400);
        res.json({ 'message': 'Some category didn\'t exist' })
    }
}

const updatePostAdmin = async (req, res) => {
    const postId = req.params['post_id'];
    const { categories, active } = matchedData(req);
    let post = await Post.getById(postId)
    if (post['is_active'] === 0 && active === 1) {
        res.json({ 'message': 'Post is inactive' })
        return;
    }
    const newCategories = await Category.getByNames(categories)
    if (newCategories.length === categories.length) {
        post = new Post({ id: postId, is_active: active })
        post.save();
        await post.deleteCategories()
        post.setCategories(newCategories);
        res.json({ 'message': 'Updated successfully' })

    } else {
        res.status(400);
        res.json({ 'message': 'Some category didn\'t exist' })
    }
}

const deletePost = async (req, res) => {
    const postId = req.params['post_id'];
    const post = await Post.getById(postId);
    if (post) {
        const result = new Post({ id: postId })
        result.delete();
        res.json(result)
    } else {
        res.status(403);
        res.json({ 'message': 'You are not allowed to delete this resource' })
    }
}

const deleteFromFavorites = async (req, res) => {
    const postId = req.params['post_id'];
    const favorite = await Favorite.getByPostUserId(postId, req.user['id']);
    if (favorite) {
        favorite.delete();
        res.json(favorite);
    } else {
        res.status(400)
        res.json({ 'message': 'Cannot find post' })
    }

}

const deleteLike = async (req, res) => {
    const postId = req.params['post_id'];
    const like = await Like.getByPostUserId(postId, req.user['id']);
    if (like) {
        like.delete()
        res.json(like);
    } else {
        res.status(403);
        res.json({ 'message': 'You are not allowed to delete this resource' })
    }
}

export { getAll, getOne, getComments, createOne, createLike, createComment, updatePost, updatePostAdmin, deletePost, deleteLike, addToFavorite, deleteFromFavorites };