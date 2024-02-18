const router = require('express').Router();
const Cart = require('../models/Cart');
const { authenticateJWT, authCartAccess } = require('./middlewares/authMiddleware');

// GET ROUTES
// To get cart by its id
router.get('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId);

    res.json({ success: true, cart: cart });
})

// POST ROUTES
// To create a new cart associated by user id
router.post('/', authenticateJWT, async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    // console.log(userId);

    if (!title) {
        return res.status(400).json({ success: false, msg: "Please provide the cart title" });
    }

    const newCart = await Cart.create({ title, userId });

    res.status(201).json({ success: true, cart: newCart });
})

// To add product to cart associated by cart id
router.post('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(400).json({ success: false, msg: "Please provide the product Id and quantity" });
    }

    const cart = await Cart.addProduct({ cartId, productId, quantity });

    res.status(201).json({success: true, cart: cart});
})

module.exports = router;