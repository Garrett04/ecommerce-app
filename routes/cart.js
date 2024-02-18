const router = require('express').Router();
const Cart = require('../models/Cart');
const { authenticateJWT } = require('./middlewares/authMiddleware');

// GET ROUTES
router.get('/:cartId', authenticateJWT, async (req, res) => {
    
})

// POST ROUTES
// To create a new cart associated by user id
router.post('/', authenticateJWT, async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    // console.log(userId);

    if (!title) {
        return res.status(400).json({ msg: "Please provide the cart title" });
    }

    const newCart = await Cart.create({ title, userId });

    res.status(201).json(newCart);
})

// To add product to cart associated by cart id
router.post('/:cartId', authenticateJWT, async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ msg: "Please provide the product Id and quantity" });
    }

    const cart = await Cart.addProduct({ cartId, productId, quantity });

    res.status(201).json(cart);
})

module.exports = router;