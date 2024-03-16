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
            const statement = `INSERT INTO orders (user_id, order_date, order_status, checkout_id, cart_id)
                                VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)
                                RETURNING *`;

            // Destructuring of the data object
            const { 
                user_id,
                checkout_id,
                cart_id
            } = data;

            // values array to insert into the statement
            const values = [ user_id, "success", checkout_id, cart_id ];

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
            const statement = `SELECT orders.id,
                                    TO_CHAR(order_date, 'DD-MM-YYYY HH24:MI:SS') AS order_date, 
                                    order_status,
                                    cart_id,
                                    title AS cart_title
                                FROM orders, carts
                                WHERE orders.cart_id = carts.id
                                AND orders.user_id = $1`;

            // query database
            const result = await db.query(statement, [userId]);
            
            if (result.rows.length > 0) {
                return result.rows;
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