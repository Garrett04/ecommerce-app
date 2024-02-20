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
}

module.exports = new Order();