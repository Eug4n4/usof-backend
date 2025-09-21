import { matchedData, validationResult } from "express-validator";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import User from "../models/User.js"
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import getAuthUserData from "../auth/getAuthUserData.js";
import { SortAscending, SortDescending } from "../db/QuerySort.js";
import { CategoryFilter, DateFilter, FieldFilter, RoleFilter } from "../db/QueryFilter.js";

const getSortingStrategy = (sort, order) => {
    let result = new SortDescending('likes');
    const setInstance = (sortField, Klass) => {
        switch (sortField) {
            case 'likes':
                result = new Klass('likes');
                break;
            case 'date':
                result = new Klass('posts.publish_date')
                break;
            default:
                break;
        }
    }
    if (order === 'asc') {
        setInstance(sort, SortAscending)
    } else if (order === 'desc') {
        setInstance(sort, SortDescending)
    }
    return result;
}

const getFilterStrategy = (categoriesLength, startInterval, endInterval, status, role) => {

    let result
    if (role) {
        result = new RoleFilter(role, result)
    } else {
        result = new RoleFilter(undefined, result);
    }
    if (status == 1 || status == 0) {
        result = new FieldFilter('posts.is_active', status, result)
    }
    if (startInterval && endInterval) {
        result = new DateFilter('posts.publish_date', startInterval, endInterval, result)
    }
    if (categoriesLength > 0) {
        result = new CategoryFilter('categories.title', categoriesLength, result);

    }

    return result;
}

const getAll = async (req, res) => {
    const { access, refresh } = req.cookies;
    const userData = getAuthUserData(access, refresh);
    let { sort, order, category, startDate, endDate, status, page } = req.query;
    page = Number(page);

    if (isNaN(page) || page < 1) {
        page = 1;
    }
    const pageSize = 10;
    const offset = (page - 1) * pageSize
    if (status === 'active') {
        status = 1;
    } else if (status === 'inactive') {
        status = 0;
    }
    const sortingStrategy = getSortingStrategy(sort, order)
    let filterStrategy;
    let queryValues = [];
    if (Array.isArray(category)) {
        queryValues.push(...category)
        filterStrategy = getFilterStrategy(category.length, startDate, endDate, status, userData?.role)
    } else {
        queryValues.push(category)
        filterStrategy = getFilterStrategy(category == undefined ? 0 : 1, startDate, endDate, status, userData?.role)
    }
    let posts;
    if (userData?.role === 'admin' || userData == undefined) {
        posts = await Post.getAll({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset }, queryValues)
    } else if (userData?.role === 'user') {
        queryValues.push(userData.id)
        posts = await Post.getAll({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset }, queryValues)
    }
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
            'data': posts
        })
    } else {
        res.json({
            'page': `${req.host}${req.baseUrl}${req.url}`,
            'next': `${req.host}${req.baseUrl}${nextUrl}`,
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
    res.json({ 'message': 'like created' })
}

const createComment = async (req, res) => {
    const { content } = matchedData(req);
    const postId = req.params['post_id'];
    new Comment({ author: req.user.id, post_id: postId, content: content }).save();
    res.status(201);
    res.json({ 'message': 'comment created' })

}

export { getAll, getOne, createOne, createLike, createComment };