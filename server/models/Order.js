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
            const statement = `INSERT INTO orders (user_id, order_date, order_status, checkout_id, cart_id, cart_details)
                                VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5)
                                RETURNING *`;

            // Destructuring of the data object
            const { 
                user_id,
                checkout_id,
                cart_id,
                cart_details // is a jsonb data type which has all of the cart items and title
            } = data;

            // console.log(cart_details);

            // values array to insert into the statement
            const values = [ user_id, "success", checkout_id, cart_id, cart_details ];

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
                                    orders.cart_id,
                                    orders.cart_details,
                                    checkout.total_amount
                                FROM orders, checkout
                                WHERE orders.checkout_id = checkout.id
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
            const statement = `SELECT orders.id AS order_id,
                                    order_status,
                                    orders.cart_id,
                                    orders.cart_details,
                                    checkout.total_amount
                                FROM carts, orders, checkout
                                WHERE carts.id = orders.cart_id
                                    AND orders.checkout_id = checkout.id
                                    AND orders.id = $1`;

            // query database
            const result = await db.query(statement, [orderId]);

            if (result.rows.length > 0) {
                return result.rows;
            }

            return null;
            
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Find order by stripe_session_id which is linked to checkout table
     * 
     * @param  {String} session_id id of stripe session
     * @return {Object|null}
     */
    async findOrderBySessionId(session_id) {
        try {
            // pg query statement
            const statement = `SELECT orders.id AS order_id
                                FROM orders, checkout
                                WHERE orders.checkout_id = checkout.id
                                    AND checkout.stripe_session_id = $1`;

            // query database
            const result = await db.query(statement, [session_id]);

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