const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET ROUTES
router.get('/', async (req, res, next) => {
    const categoryId = req.query.category;

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

router.get('/', async (req, res) => {
    const products = await Product.find();

    if (!products) {
        return res.status(404).find({ msg: "No products found." })
    }

    res.json(products);
})

router.get('/:productId', async(req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ msg: "Product not found by product id." });
    }

    res.json(product);
})

module.exports = router;