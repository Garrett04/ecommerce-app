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

            // console.log(values);

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
     * Update user address by user id
     * 
     * @param  {Array} data data of new user address and user id
     * @return {Object|null} Updated user address
     */
    async update(data) {
        try {
            // pg query statement
            const statement = `UPDATE addresses
                                SET address_line1 = $2,
                                    address_line2 = $3,
                                    city = $4,
                                    state = $5,
                                    postal_code = $6,
                                    country = $7
                                WHERE id = $1
                                RETURNING *`;

            // Destructuring of data object
            const {
                id,
                address_line1,
                address_line2,
                city,
                state,
                postal_code,
                country
            } = data;

            // values array to insert to statement
            const values = [ 
                id,
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

    /**
     * Delete address by address id
     * 
     * @param  {String} addressId id of address
     * @return {String|null} deleted address id
     */
    async delete(addressId) {
        try {
            // pg query statement
            const statement = `DELETE FROM addresses
                                WHERE id = $1
                                RETURNING *`;

            // query database
            const result = await db.query(statement, [addressId]);

            if (result.rows.length > 0) {
                return result.rows[0].id;
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve address by user id
     * 
     * @param  {String} userId id of user
     * @return {Array|null} an array of addresses  
     */
    async findByUserId(userId) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM addresses
                                WHERE user_id = $1`;

            // query database
            const result = await db.query(statement, [userId]);

            if (result.rows.length > 0) {
                // console.log(result.rows);
                return result.rows;
            }
            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve address by address id
     * 
     * @param  {String} addressId id of address
     * @return {Object|null} an object of the address
     */
    async find(addressId) {
        try {
            // pg query statement
            const statement = `SELECT * FROM addresses
                                WHERE id = $1`

            // query database
            const result = await db.query(statement, [addressId]);

            if (result.rows.length > 0) {
                console.log(result.rows[0]);
                return result.rows[0];
            }
            return null;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Address();