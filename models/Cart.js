const db = require('../db/index');

class Cart {
    /**
     * Add new cart to database by the userId
     * 
     * @param  {Object} data Data of the new cart
     * @return {Object|null} New cart object
     */
    async create(data) {
        try {
            // pg query statement
            const statement = `INSERT INTO carts (title, user_id)
                                VALUES ($2, $1)
                                RETURNING *`;

            // values array to insert to the statement
            const values = [data.userId, data.title];

            // query database
            const result = await db.query(statement, values);
        
            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Update cart by cartId
     * 
     * @param  {Object} data Data of the cart to update
     * @return {Object|null} Updated cart object
     */
    async update(data) {
        try {
            // pg query statement
            const statement = `UPDATE carts
                                SET title = $2
                                WHERE id = $1
                                RETURNING *`;

            // values array to insert to the statement
            const values = [data.id, data.title];

            // query database
            const result = await db.query(statement, values);

            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve cart by cartId
     * 
     * @param  {String} cartId Id of cart
     * @return {Object|null} Cart object 
     */
    async findById(cartId) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM carts
                                WHERE id = $1`;

            // query database
            const result = await db.query(statement, [cartId]);

            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Cart();