const pool = require('./dbConfig');

// users table
const findByUsername = async (username) => {
    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const users = await pool.query(
            query,
            [username]
        )

        if (users.rows.length > 0) {
            // console.log('Found user');
            return users.rows[0]; 
        }

        return false;
    } catch (err) {
        console.error('Error finding user by username: ', err.message);
        throw new Error('Error finding user by username');
    }
}

const createUser = async (name, username, hashedPassword) => {
    try {
        const query = 'INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING *';
        const newUser = await pool.query(
            query,
            [name, username, hashedPassword] 
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
            return user.rows[0]; // Previously: user.rows
        }
        return false;
    } catch (err) {
        console.error('Error finding user by id: ', err.message);
        throw new Error('Error finding user by id');
    }
}

// products, categories, and categories_products table
const findByCategory = async (categoryId) => {
    try {   
        const query = `SELECT products.name 
                        FROM products, categories_products 
                        WHERE categories_products.category_id = $1
                            AND categories_products.product_id = products.id`;
        const products = await pool.query(
            query,
            [categoryId]
        );

        if (products.rows.length > 0) {
            console.log(products.rows);
            return products.rows;
        }

        return false;
    } catch (err) {
        console.error('Error finding products by category id: ', err.message);
        throw new Error('Error finding products by category id');
    }
}

const findByProductID = async (productID) => {
    try {   
        const query = `SELECT products.name 
                        FROM products 
                        WHERE products.id = $1`;

        const product = await pool.query(
            query,
            [productID]
        );

        if (product.rows.length > 0) {
            return product.rows;
        }

        return false;
    } catch (err) {
        console.error('Error finding products by product id: ', err.message);
        throw new Error('Error finding products by product id');
    }
}

module.exports = { 
    findByUsername,
    createUser,
    findById,
    findByCategory,
    findByProductID,
}