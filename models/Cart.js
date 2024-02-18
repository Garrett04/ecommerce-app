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
    async findById(cartId) {
        try {
            // pg query statement
            const statement = `SELECT carts_products.cart_id,
                                        carts.user_id, 
                                        products.name AS product_name, 
                                        carts_products.quantity AS product_quantity, 
                                        products.price AS product_price
                                FROM carts, products, carts_products
                                WHERE carts_products.cart_id = $1
                                    AND products.id = carts_products.product_id
                                    AND carts_products.cart_id = carts.id`;

            // query database
            const result = await db.query(statement, [cartId]);

            if (result.rows.length > 0) {
                // console.log(result.rows);
                return result.rows;
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    // /**
    //  * Retrieve cart by userId
    //  * 
    //  * @param  {String} userId Id of user
    //  * @return {Object|null} Cart object
    //  */
    // async findByUserId(userId) {
    //     try {
    //         // pg query statement
    //         const statement = `SELECT *
    //                             FROM carts
    //                             WHERE user_id = $1`;
            
    //         // query database
    //         const result = await db.query(statement, [userId]);

    //         if (result.rows.length > 0) {
    //             console.log(result.rows[0]);
    //             return result.rows[0];
    //         }

    //         return null;
    //     } catch (err) {
    //         throw new Error(err);
    //     }
    // }
}

module.exports = new Cart();