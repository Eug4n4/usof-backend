import { matchedData } from "express-validator";
import UserDto from "../dto/UserDto.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import hash_password from "../utils/hash_password.js";
import Favorite from "../models/Favorite.js";
import { PostSortStrategy } from "../strategies/SortStrategy.js";
import { getFilterStrategy } from "../posts/post.controller.js";
import Post from "../models/Post.js";


const getAll = async (req, res) => {
    const result = await User.getAll();
    res.json(result);
}

const getOne = async (req, res) => {
    const id = Number.parseInt(req.params['user_id']);
    if (id) {
        const user = await User.getById(id);
        res.json(user);
    } else {
        res.status(400);
        res.json({ 'message': 'Provide valid user_id' })
    }
}

const getFavorites = async (req, res) => {
    const id = req.user.id
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
    filterOptions.push({ name: "id", value: { field: "favorites.user_id", value: id } })
    filterOptions.push({ name: "status", value: { field: "posts.is_active", value: status } })
    filterOptions.push({ name: "date", value: { field: "posts.publish_date", value: { from: startDate, to: endDate } } })
    filterOptions.push({ name: "categories", value: queryValues })
    const filterStrategy = getFilterStrategy(filterOptions);
    try {
        const favorites = await Favorite.getByUserId({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset }, queryValues);

        const count = await Favorite.getCount(id);
        res.json({ data: favorites, total: count.total });

    } catch (e) {
        console.log(e.message)
        res.status(404).json({ message: "I cant find this" })
    }
}

const getUserPosts = async (req, res) => {
    const id = req.user.id
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
    filterOptions.push({ name: "id", value: { field: "posts.author", value: id } })
    filterOptions.push({ name: "status", value: { field: "posts.is_active", value: status } })
    filterOptions.push({ name: "date", value: { field: "posts.publish_date", value: { from: startDate, to: endDate } } })
    filterOptions.push({ name: "categories", value: queryValues })
    const filterStrategy = getFilterStrategy(filterOptions);

    try {
        const posts = await Post.getByAuthorId({ sort: sortingStrategy, filter: filterStrategy, pageSize: pageSize, offset: offset }, queryValues)
        const count = await Post.getAuthorCount(id);
        res.json({ total: count.total, data: posts })
    } catch (e) {
        console.warn(e.message)
        res.status(404).json({ message: "I cant find this" })
    }
}

const createUser = async (req, res) => {
    const { login, full_name, email, password, role } = matchedData(req);
    const { id } = await Role.getByName(role);
    const hashed = await hash_password(password);
    await new User({ login, full_name, email, password: hashed, role_id: id }).save();
    const user = await User.findBy('login', login);
    const dto = await UserDto.createInstance(user);
    res.status(201);
    res.json(dto)
}

const updateUser = async (req, res) => {
    const { full_name, role, password } = matchedData(req);
    const user = await User.getById(req.params['user_id'])
    if (user) {
        const roleInfo = await Role.getByName(role);
        if (user.id != req.user['id']) {
            if (roleInfo) {
                user.role_id = roleInfo.id;
            }
        } else {
            if (password) {
                const hashed = await hash_password(password)
                user.password = hashed;
            }
        }
        user.full_name = full_name;
        await user.save()
        const dto = await UserDto.createInstance(user);
        res.json(dto)
    } else {
        res.status(400)
        res.json({ 'message': 'Cannot find user' })
    }

}

const deleteUser = async (req, res) => {
    const user = await User.getById(req.params['user_id']);
    if (user) {
        if (req.user['id'] == user.id) {
            res.json({ 'message': 'You cannot delete yourself' })
            return;
        }
        const dto = await UserDto.createInstance(user);
        user.delete();
        res.json(dto);
    } else {
        res.status(400)
        res.json({ 'message': 'Cannot find user' })
    }
}

const uploadAvatar = async (req, res) => {
    const user = await User.getById(req.params['user_id']);
    if (user) {
        if (!req.file) {
            res.status(400).json({ 'message': 'No image uploaded!' })
            return;
        }
        const fileName = req.file.filename;
        user.photo = `uploads/avatars/${fileName}`
        const dto = await UserDto.createInstance(user);
        await user.save();
        res.json(dto)

    } else {
        res.status(400)
        res.json({ 'message': 'Cannot find user' })
    }

}
export { getAll, getOne, getUserPosts, createUser, updateUser, deleteUser, uploadAvatar, getFavorites };