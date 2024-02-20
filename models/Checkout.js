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
                                shipping_address, 
                                billing_address,
                                subtotal,
                                tax,
                                shipping_cost,
                                total_amount,
                                checkout_date,
                                checkout_status
                            ) VALUES (
                                $1,
                                $2,
                                $3,
                                $4,
                                $5,
                                $6,
                                $7,
                                CURRENT_DATE,
                                $8
                            )
                            RETURNING *`;
        
        // destructuring of data
        const {
            cartId, 
            payment_method,
            shipping_address,
            billing_address  
        } = data;

        const subtotal = await Cart.getSubtotal(cartId);
        console.log(subtotal);

        // values array to insert to the statement
        const values = [ 
            payment_method, 
            shipping_address, 
            billing_address, 
            subtotal, 
            null, // for now let tax be null
            null, // let shipping_cost be null
            subtotal, // let total_amount be the subtotal since for now since no tax and shipping_cost is present
            "success" // "pending" || "success" || "failed"
        ];

        try {
            // query database
            const result = await db.query(statement, values);

            console.log(result.rows[0]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Checkout();