import { matchedData, validationResult } from "express-validator";
import Category from "../models/Category.js";

const getAll = async (req, res) => {
    const result = await Category.getAll();
    res.json(result);
}

const getOne = async (req, res) => {
    const id = Number.parseInt(req.params['category_id']);
    if (id) {
        const category = await Category.getById(id);
        res.json(category);
    } else {
        res.status(400);
        res.json({ 'message': 'Provide valid category_id' })
    }
}

const getCategoryPosts = async (req, res) => {
    const id = Number.parseInt(req.params['category_id']);
    if (id) {
        const posts = await Category.getRelatedPosts(id);
        res.json(posts);
    } else {
        res.status(400);
        res.json({ 'message': 'Provide valid category_id' })

    }


}

const createOne = async (req, res) => {
    const { title, description } = matchedData(req);
    let category;
    if (description) {
        category = new Category({ title, description })
    } else {
        category = new Category({ title })
    }
    category.save();
    res.json(category)
}

const deleteCategory = async (req, res) => {
    const id = req.params['category_id'];
    const category = new Category({ id: id })
    category.delete();
    res.json(category)

}

const updateCategory = async (req, res) => {
    const { title, description } = matchedData(req);
    const category = await Category.getById(req.params['category_id']);
    if (category) {
        category.title = title;
        category.description = description;
        await category.save();
        res.json(category)
    } else {
        res.status(400)
        res.json({ 'message': 'Cannot find category' })
    }
}

export { getOne, getAll, getCategoryPosts, createOne, deleteCategory, updateCategory }