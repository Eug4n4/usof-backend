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

    static async findBy(field, value) {
        const [rows] = await connectionPool.promise().query(
            `SELECT * FROM tokens WHERE ${field} = ?`,
            [value]
        );
        const row = rows[0];
        if (!row) {
            return null;
        }
        return new Token(Object.assign({}, row));
    }

    async delete() {
        await connectionPool.promise().query(`DELETE from ${Token.#table} WHERE refresh = ?`, [this.refresh]);
    }
}

export default Token;