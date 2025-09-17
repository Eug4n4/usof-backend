import { connectionPool } from "../db/db.js";
import Model from "./Model.js";



class Token extends Model {
    static #table = 'tokens'
    constructor(args) {
        super(args)
        Model.table = Token.#table
    }

    static get table() {
        return Token.#table
    }

    async delete(token) {
        await connectionPool.promise().query(`DELETE from ${Token.#table} WHERE refresh = ?`, [token]);
    }
}

export default Token;