const db = require('../db/index');

class Order {

    /**
     * Create an order by checkout id
     * 
     * @param  {Object} data data of the order
     * @return {Object|null} new order object 
     */
    async create(data) {
        try {
            // pg query statement
            const statement = `INSERT INTO orders (user_id, order_date, order_status, checkout_id)
                                VALUES ($1, CURRENT_DATE, $2, $3)
                                RETURNING *`;

            // Destructuring of the data object
            const { 
                user_id,
                checkout_id
            } = data;

            // values array to insert into the statement
            const values = [ user_id, "success", checkout_id ];

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
     * Retrieve orders by user_id
     * 
     * @param  {String} userId id of user
     * @return {Array|Object|null} all past orders 
     */
    async find(userId) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM orders
                                WHERE user_id = $1`;

            // query database
            const result = await db.query(statement, [userId]);
            
            if (result.rows.length == 1) {
                return result.rows;
            } else if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve order by order id
     * 
     * @param  {String} orderId id of order
     * @return {Object|null} order object
     */
    async findById(orderId) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM orders
                                WHERE id = $1`;

            // query database
            const result = await db.query(statement, [orderId]);

            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;
            
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Order();