import express from 'express';
import User from './models/User.js'

const router = express.Router();

router.get('/users', async (req, res) => {
    const result = await User.getAll();
    res.json(result);
})


export default router;