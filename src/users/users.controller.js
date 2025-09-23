import { matchedData } from "express-validator";
import UserDto from "../dto/UserDto.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import hash_password from "../utils/hash_password.js";


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
export { getAll, getOne, createUser, updateUser, deleteUser };