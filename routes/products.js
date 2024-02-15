const express = require('express');
const productsRouter = express.Router();

const { findByCategory, findByProductID } = require('../db/dbHelperFunctions');

productsRouter.get('/', async (req, res) => {
    const categoryId = req.query.category;
    
    const products = await findByCategory(categoryId);

    if (!products) {
        return res.status(404).send("No products found by category");
    }

    res.json(products);

});

productsRouter.get('/:productID', async (req, res) => {
    const { productID } = req.params;

    const product = await findByProductID(productID);

    if (!product) {
        return res.status(404).send("Product not found by product id"); 
    }

    res.json(product);

})

module.exports = productsRouter;