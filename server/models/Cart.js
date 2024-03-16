const db = require('../db/index');

class Cart {
    /**
     * Add new cart to database by the userId
     * 
     * @param  {Object} data Data of the new cart
     * @return {Object|null} New cart object
     */
    async create(data) {
        try {
            // pg query statement
            const statement = `INSERT INTO carts (title, user_id)
                                VALUES ($2, $1)
                                RETURNING *`;           

            // values array to insert to the statement
            const values = [data.userId, data.title];

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
     * Add product to cart associated by cartId
     * 
     * @param  {Object} data Data containing of cartId and productId
     * @return {Object|null} Updated cart object
     */
    async addProduct(data) {
        try {
            // pg query statement
            const statement = `WITH updated_cart AS (
                                    INSERT INTO carts_products (cart_id, product_id, quantity)
                                    VALUES ($1, $2, $3)
                                    RETURNING *
                                )
                                SELECT carts.id AS cart_id, 
                                    products.name AS product_name, 
                                    products.price AS product_price, 
                                    updated_cart.quantity AS product_quantity 
                                FROM carts, products, updated_cart
                                WHERE updated_cart.cart_id = carts.id
                                    AND updated_cart.product_id = products.id`;

            // values array to insert to statement
            const values = [data.cartId, data.productId, data.quantity];

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
     * Update cart by cartId
     * 
     * @param  {Object} data Data of the cart to update
     * @return {Object|null} Updated cart object
     */
    async update(data) {
        try {
            // pg query statement
            const statement = `UPDATE carts
                                SET title = $2
                                WHERE id = $1
                                RETURNING *`;

            // values array to insert to the statement
            const values = [data.id, data.title];

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
     * Retrieve cart by cartId
     * 
     * @param  {String} cartId Id of cart
     * @return {Object|null} Cart object 
     */
    async findById(is_carts_table, cartId) {
        let statement;

        // If is_carts_table is false then retrieve from the carts_products table.
        if (!is_carts_table) {
            statement = `SELECT carts.title AS cart_title,
                                carts_products.cart_id,
                                carts.user_id, 
                                carts.id AS carts_table_id,
                                products.id AS product_id,
                                products.name AS product_name, 
                                carts_products.quantity AS product_quantity, 
                                products.price AS product_price
                        FROM carts, products, carts_products
                        WHERE carts_products.cart_id = $1
                            AND products.id = carts_products.product_id
                            AND carts_products.cart_id = carts.id`;
        } else {
            statement = `SELECT *
                        FROM carts
                        WHERE id = $1`;
        }

        try {
            // query database
            const result = await db.query(statement, [cartId]);

            // console.log(result.rows[0]);
            // console.log(result.rows.length);
            // console.log(statement);
            // console.log(result.rows.length);
            if (result.rows.length == 1 && is_carts_table) { // If there's only one row then return that row object.
                // console.log(result.rows[0])
                return result.rows[0];
            } else if (result.rows.length > 0) {
                // console.log(result.rows);
                return result.rows;
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Delete cart associated by cart id
     * 
     * @param  {String} cartId id of cart
     * @return {null} 
     */
    async delete(cartId) {
        try {
            // pg query statement
            const statement = `DELETE FROM carts
                                WHERE carts.id = $1
                                RETURNING *`;

            // query database
            const result = await db.query(statement, [cartId]);

            // console.log(result.rows);
            // console.log(result.rows.length);
            if (result.rows.length > 0) {
                return result.rows[0];
            } 
            
            return null;

        } catch (err) {
            throw new Error(err);
        }
    } 

    /**
     * Get subtotal associated by cart id
     * 
     * @param  {String} cartId id of cart
     * @return {String|null} subtotal string
     */
    async getSubtotal(cartId) {
        try {
            // pg query statement
            const statement = `WITH subtotal AS (
                                    SELECT carts_products.quantity AS product_quantity, 
                                            products.price AS product_price
                                    FROM carts, products, carts_products
                                    WHERE carts_products.cart_id = $1
                                        AND products.id = carts_products.product_id
                                        AND carts_products.cart_id = carts.id
                                )
                                SELECT SUM(product_quantity * product_price) AS subtotal
                                FROM subtotal`;

            // query database
            const result = await db.query(statement, [cartId]);

            // console.log("from getSubtotal")

            if (result.rows.length > 0) {
                return result.rows[0].subtotal;
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Get all carts associated by user Id
     * 
     * @param   {String} String an object containing get_products_ids a boolean and user id 
     * @return  {Object|null} an object of carts
     */
    async find(userId) {
        try {
            const statement = `SELECT carts.id, 
                                    carts.title,
                                    ARRAY_AGG(products.id) AS product_ids
                                FROM carts
                                LEFT JOIN carts_products ON carts.id = carts_products.cart_id
                                LEFT JOIN products ON carts_products.product_id = products.id
                                WHERE user_id = $1
                                GROUP BY carts.id`;

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
}

module.exports = new Cart();