import { validationResult } from 'express-validator';


const registration = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400);
		res.json(errors.array());
	} else {
		res.status(201);
		res.json({ "user": "value" })
	}
}

export default registration;