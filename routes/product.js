const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @swagger
 * definitions:
 *  Product:
 *      properties:
 *          name:
 *              type: string
 *          price:
 *              type: float
 */


// GET ROUTES
/**
 * @swagger
 * /api/products/category/{categoryId}:
 *  get:
 *      tags:
 *          - products
 *      description: Find products by category ID
 *      produces: application/json
 *      parameters:
 *          - name: categoryId
 *            in: path
 *            description: Category ID
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: An array of products
 *              schema:
 *                  $ref: '#/definitions/Product'
 */
router.get('/category/:categoryId', async (req, res, next) => {
    const categoryId = req.params.categoryId;

    // If categoryId is not found then go to the next route else proceed.
    if (!categoryId) {
        return next();
    }

    const products = await Product.findByCategory(categoryId);

    if (!products) {
        return res.status(404).json({ msg: "No products found by category." });
    }

    res.json(products);
})

/**
 * @swagger
 * /api/products:
 *  get:
 *      tags:
 *          - products
 *      description: Retrieves all products
 *      produces: application/json
 *      responses:
 *          200:
 *              description: An array of products
 *              schema:
 *                  $ref: '#/definitions/Product'
 */
router.get('/', async (req, res) => {
    const products = await Product.find();

    if (!products) {
        return res.status(404).find({ msg: "No products found." })
    }

    res.json(products);
})

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - products
 *     description: Returns a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: Product id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/definitions/Product'
 */
router.get('/:productId', async(req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ msg: "Product not found by product id." });
    }

    res.json(product);
})

module.exports = router;