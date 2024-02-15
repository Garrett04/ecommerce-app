const pool = require('./dbConfig');

const findByUsername = async (username) => {
    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const users = await pool.query(
            query,
            [username]
        )

        if (users.rows.length > 0) {
            // console.log('Found user');
            return false; 
        }

        return true;
    } catch (err) {
        console.error('Error finding user by username: ', err.message);
        throw new Error('Error finding user by username');
    }
}

const createUser = async (username, hashedPassword) => {
    try {
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
        const newUser = await pool.query(
            query,
            [username, hashedPassword] 
        ) 

        return newUser;
    } catch (err) {
        console.error('Error creating new user: ', err.message);
        throw new Error('Error creating new user');
    }
}

const findById = async (id) => {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const user = await pool.query(
            query,
            [id]
        )

        if (user.rows.length > 0) {
            return user.rows;
        }
        return false;
    } catch (err) {
        console.error('Error finding user by id: ', err.message);
        throw new Error('Error finding user by id');
    }
}

module.exports = { 
    findByUsername,
    createUser,
    findById
}