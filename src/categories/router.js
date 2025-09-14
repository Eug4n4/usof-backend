import express from "express";
import Category from "../models/Category.js";

const categoryRouter = express.Router();

categoryRouter.get('/', async (req, res) => {
    const result = await Category.getAll();
    res.json(result);
})

export default categoryRouter;