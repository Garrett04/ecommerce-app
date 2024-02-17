const db = require('../db/index');

class Product {
    /**
     * Retrieve all products from database
     * 
     * @return {Array|null} an array of products
     */
    async find() {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM products`;
            
            // query database
            const result = await db.query(statement);

            // If result valid return it, else return null
            if (result.rows.length > 0) {
                return result.rows;
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve a single product object associated by id
     * 
     * @param  {String} id Product id
     * @return {Object|null} Product info
     */
    async findById(id) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM products
                                WHERE id = $1`;

            // query database
            const result = await db.query(statement, [id]);

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
     * Retrieve product(s) by category
     * 
     * @param  {String} id Category id
     * @return {Object|null} An array of products
     */
    async findByCategory(id) {
        try {
            // pg query statement
            const statement = `SELECT *
                                FROM products, categories_products
                                WHERE categories_products.category_id = $1
                                    AND categories_products.product_id = products.id`;

            // query database
            const result = await db.query(statement, [id]);

            // If result is valid return it, else return null
            if (result.rows.length > 0) {
                return result.rows;
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Product();