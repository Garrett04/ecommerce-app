const db = require('../db/index');

class Address {

    /**
     * Create new address associated by user id
     * 
     * @param  {Object} data data of user address and user id
     * @return {Object|null} new address object
     */
    async create(data) {
        try {
            // pg query statement
            const statement = `INSERT INTO addresses (
                                    user_id, 
                                    address_line1, 
                                    address_line2, 
                                    city,
                                    state,
                                    postal_code,
                                    country
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                                RETURNING *`;

            // destructuring of data object
            const {
                user_id,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country
            } = data;

            // values array to insert to the statement
            const values = [
                user_id, 
                address_line1, 
                address_line2,
                city,
                state,
                postal_code,
                country
            ];

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

module.exports = new Address();