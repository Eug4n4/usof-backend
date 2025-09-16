import express from "express";
import { getAll, getCategoryPosts, getOne } from "./category.controller.js";
import { getByParameter } from "../utils/getByParameter.js";
import Category from "../models/Category.js";

const categoryRouter = express.Router();

categoryRouter.get('/', getByParameter(undefined, Category.getAll))
categoryRouter.get('/:category_id', getByParameter('category_id', Category.getById))
categoryRouter.get('/:category_id/posts', getByParameter('category_id', Category.getRelatedPosts))
export default categoryRouter;