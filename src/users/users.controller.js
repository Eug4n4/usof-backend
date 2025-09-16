import User from "../models/User.js";


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

export { getAll, getOne };