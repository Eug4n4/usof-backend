import { connectionPool } from "../db/db.js";

class Model {
    #table;
    constructor(attributes = {}) {
        Object.assign(this, attributes);
    }


    static async getAll() {

    }

    async delete() {

        if (this.id) {
            await connectionPool.promise().query(`DELETE FROM ${this.#table} WHERE id = ?`, [this.id]).catch(console.log)
        }
    }

    async save() {
        const definedProperties = [];
        const values = [];
        for (const property of Object.getOwnPropertyNames(this)) {
            if (this[property] != undefined && property != 'id') {
                definedProperties.push(property);
                values.push(this[property]);
            }
        }
        if (this.id) {
            const updateQuery = `UPDATE ${this.#table} SET ${definedProperties.join(" = ?,") + " = ?"} WHERE id = ?`;
            await connectionPool.promise().query(updateQuery, values.concat(this.id)).catch(error => console.log(error.message));
        } else {
            let queryParams = `?,`.repeat(definedProperties.length);
            queryParams = queryParams.slice(0, queryParams.length - 1);
            const insertQuery = `INSERT INTO ${this.#table} (${definedProperties.join(',')}) VALUES (${queryParams})`;
            const [result] = await connectionPool.promise().query(insertQuery, values);
            this.id = result.insertId;
        }
    }
    set table(value) {
        this.#table = value;
    }
    get table() {
        return this.#table;
    }
}

export default Model;