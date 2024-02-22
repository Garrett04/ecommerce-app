const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @swagger
 * tags:
 *      name: products
 *      description: The products managing api
 */

/**
 * @swagger
 * definitions:
 *  Product:
 *      properties:
 *          id:
 *              type: integer
 *          name:
 *              type: string
 *          price:
 *              type: float
 *      example:
 *          id: 1
 *          name: T-shirt
 *          price: $19.99
 */


// GET ROUTES
/**
 * @swagger
 * /api/products/category/{categoryId}:
 *  get:
 *      tags:
 *          - products
 *      summary: Find all products by category ID
 *      description: Find all products by category ID
 *      produces: application/json
 *      parameters:
 *          - name: categoryId
 *            in: path
 *            description: Category ID
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: An array of products found by category id
 *          404:
 *              description: No products found by category
 *              schema:
 *                  type: object
 *                  properties:
 *                      success: 
 *                          type: boolean
 *                      msg:
 *                          type: boolean
 *                  example:
 *                      success: false
 *                      msg: No products found by category
 */
router.get('/category/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params;

    // If categoryId is not found then go to the next route else proceed.
    if (!categoryId) {
        return next();
    }

    const products = await Product.findByCategory(categoryId);

    if (!products) {
        return res.status(404).json({ success: false, msg: "No products found by category." });
    }

    res.json({ success: true, products: products });
})

/**
 * @swagger
 * /api/products:
 *  get:
 *      tags:
 *          - products
 *      summary: Retrieve all products
 *      description: Retrieves all products
 *      responses:
 *          200:
 *              description: An array of products
 *          404:
 *              description: No products found
 *              schema:
 *                  type: object
 *                  properties:
 *                      success: 
 *                          type: boolean
 *                      msg:
 *                          type: boolean
 *                  example:
 *                      success: false
 *                      msg: No products found
 */
router.get('/', async (req, res) => {
    const products = await Product.find();

    if (!products) {
        return res.status(404).find({ success: false, msg: "No products found." })
    }

    res.json({ success: true, products: products});
})

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - products
 *     summary: Find product by product id
 *     description: Returns a single product
 *     parameters:
 *       - name: productId
 *         description: Product id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: The product details by id
 *         schema:
 *              type: object
 *              properties:
 *                  success:
 *                      type: boolean
 *                  product:
 *                      $ref: '#/definitions/Product'  
 *       404:
 *          description: Product not found by product id
 *          schema:
 *              type: object
 *              properties:
 *                  success: 
 *                      type: boolean
 *                  msg:
 *                      type: string
 *              example:
 *                  success: false
 *                  msg: Product not found by product id
 */
router.get('/:productId', async(req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ success: false, msg: "Product not found by product id." });
    }

    res.json({ success: true, product: product});
})

module.exports = router;