const express = require('express');
const { createCart } = require('../db/dbHelperFunctions');
const cartsRouter = express.Router();



// POST routes
cartsRouter.post('/', (req, res) => {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
        return res.status(400).send("Please provide title for the cart");
    }

    const newCart = createCart(title, userId);

    res.status(201).json(newCart);
    
})

module.exports = cartsRouter;