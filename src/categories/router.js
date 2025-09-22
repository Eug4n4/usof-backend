import express from "express";
import { createOne, deleteCategory, getAll, getCategoryPosts, getOne } from "./category.controller.js";
import { getByParameter } from "../utils/getByParameter.js";
import Category from "../models/Category.js";
import { categoryValidator } from "../validators/category.validators.js";
import authMiddleware from "../auth/authMiddleware.js";
import validationErrors from "../validators/validationErrorsMiddleware.js";
import { mustBeAdmin } from "../utils/permissionCheck.js";

const categoryRouter = express.Router();

categoryRouter.get('/', getByParameter(undefined, Category.getAll))
categoryRouter.get('/:category_id', getByParameter('category_id', Category.getById))
categoryRouter.get('/:category_id/posts', getByParameter('category_id', Category.getRelatedPosts))
categoryRouter.post('/', authMiddleware, ...categoryValidator, validationErrors, mustBeAdmin, createOne)
categoryRouter.delete('/:category_id', authMiddleware, mustBeAdmin, deleteCategory)
export default categoryRouter;