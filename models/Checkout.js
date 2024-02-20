const db = require('../db/index');
const Cart = require('./Cart');

class Checkout {
    
    /**
     * Add new checkout
     * @param  {Object} data All payment details
     * @return {Object|null} New payment object
     */
    async processPayment(data) {
        // pg query statement
        const statement = `INSERT INTO checkout (
                                payment_method, 
                                shipping_address_id, 
                                billing_address_id,
                                subtotal,
                                tax,
                                shipping_cost,
                                total_amount,
                                checkout_date,
                                checkout_status,
                                cart_id
                            ) VALUES (
                                $1,
                                $2,
                                $3,
                                $4,
                                $5,
                                $6,
                                $7,
                                CURRENT_DATE,
                                $8,
                                $9
                            )
                            RETURNING *`;
        
        // destructuring of data
        const {
            cartId, 
            payment_method,
            shipping_address_id,
            billing_address_id
        } = data;

        const subtotal = await Cart.getSubtotal(cartId);
        console.log(subtotal);

        // values array to insert to the statement
        const values = [ 
            payment_method, 
            shipping_address_id, 
            billing_address_id, 
            subtotal, 
            null, // for now let tax be null
            null, // let shipping_cost be null
            subtotal, // let total_amount be the subtotal since for now since no tax and shipping_cost is present
            "success", // "pending" || "success" || "failed"
            cartId
        ];

        try {
            // query database
            const result = await db.query(statement, values);

            // console.log(result.rows[0]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Check if payment already exists by cart id
     * 
     * @param  {String} cartId id of cart
     * @return {Boolean} boolean of true or false if payment exists 
     */
    async checkPaymentExists(cartId) {
        try {
            // pg query statement
            const statement =  `SELECT *
                                FROM checkout
                                WHERE cart_id = $1`;

            // query database
            const result = await db.query(statement, [cartId]);

            if (result.rows.length > 0) {
                return true;
            }

            return false;

        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Checkout();