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
}

module.exports = new User();