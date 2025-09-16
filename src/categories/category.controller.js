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

export { getOne, getAll, getCategoryPosts }