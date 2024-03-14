const db = require('../db/index');

class User {
    /**
     * Create new user
     * 
     * @param  {Object} data User info
     * @return {Object|null} New user
     */
    async create(data) {
        try {
            // pg query statement
            const statement = `INSERT INTO users (username, pw_hash, pw_salt) 
                            VALUES ($1, $2, $3) 
                            RETURNING *`;

            // values array to insert to the statement
            const values = [data.username, data.hash, data.salt];

            // query database
            const result = await db.query(statement, values);

            // If result is valid return it, else return null
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Updates a user in the database
     * 
     * @param  {Object} data  User info to update
     * @return {Object|null}  Updated user
     */
    async update(data) {
        try {
            // pg query statement
            const statement = `UPDATE users
                                SET username=$2,
                                    first_name=$3,
                                    last_name=$4,
                                    pw_hash=$5,
                                    pw_salt=$6
                                WHERE id = $1
                                RETURNING *`;

            // values array to insert to the statement
            const values = [data.id, data.username, data.first_name, data.last_name, data.pw_hash, data.pw_salt];

            // query database
            const result = await db.query(statement, values);

            // If result is valid return it, else return null
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Find user info in the database by username
     * 
     * @param  {String} username username
     * @return {Object|null} User info 
     */
    async findByUsername(username) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM users
                                WHERE username = $1`;
            
            // query database
            const result = await db.query(statement, [username]);

            // If result is valid return it, else return null
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Find user info in the database by id
     * 
     * @param  {String} id user id
     * @return {Object|null} User info 
     */
    async findById(id) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM users
                                WHERE id = $1`;
            
            // query database
            const result = await db.query(statement, [id]);

            // If result is valid return it, else return null.
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Find or create user
     * 
     * @param  {Object} data googleId and username of user
     * @return {Object|null} user object
     */
    async findOrCreate(data) {
        try {
            // pg query statement for finding by googleId
            const statement = `SELECT * FROM users WHERE google_id = $1`;

            // query database to find user
            const user = await db.query(statement, [data.googleId]);

            if (user.rows.length <= 0) {
                // pg query statement for creating user
                const statement = `INSERT INTO users (google_id, username, first_name, last_name, login_method)
                                    VALUES ($1, $2, $3, $4, $5)
                                    RETURNING *`;

                // values array
                const values = [data.googleId, data.username, data.first_name, data.last_name, data.login_method]

                // query database to create user
                const newUser = await db.query(statement, values);
                
                if (newUser.rows.length > 0) {
                    // console.log(result.rows[0]);
                    return newUser.rows[0];
                }

                return null;
            } else {
                return user.rows[0];
            }

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Update default_shipping_address_id or billing_address_id in users table
     * 
     * @param  {String} data id of user, default_shipping_address_id and default_billing_address_id
     * @return {Object|null} object of address 
     */
    async updateDefaults(data) {
        try {
            // pg query statement
            const statement = `UPDATE users
                                SET default_shipping_address_id = $2,
                                    default_billing_address_id = $3
                                WHERE id = $1
                                RETURNING *`;

            // values array
            const values = [
                data.userId, 
                data.default_shipping_address_id, 
                data.default_billing_address_id
            ];

            // query database
            const result = await db.query(statement, values);

            if (result.rows.length > 0) {
                // console.log(result.rows[0]);
                return result.rows[0];
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new User();