import { matchedData, validationResult } from "express-validator";
import Category from "../models/Category.js";

const getAll = async (req, res) => {
    let { page, pageSize } = req.query;
    page = Number(page);
    pageSize = Number(pageSize);
    if (isNaN(page) || page < 1) {
        page = 1;
    }
    if (isNaN(pageSize) || pageSize < 1) {
        pageSize = 5;
    }
    const offset = (page - 1) * pageSize;
    const queryValues = [];
    queryValues.push(offset);
    queryValues.push(pageSize);
    const result = await Category.getAll(queryValues);
    const total = await Category.getCount();

    res.json({ "total": total.total, "data": result });
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