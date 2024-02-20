const router = require('express').Router();
const Cart = require('../../models/Cart');
const { 
    authenticateJWT, 
    authCartAccess
} = require('../middlewares/authMiddleware');

// GET ROUTES
// To get cart by its id
router.get('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;

    // Calls findById which takes in an is_carts_table boolean value of false indicating to retrieve from the carts_products table
    const cart = await Cart.findById(false, cartId);

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

// PUT ROUTES
// To update cart details
router.put('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, msg: "Please provide the cart title" });
    }

    const updatedCart = await Cart.update({ id: cartId, title });

    // console.log("updatedCart:", updatedCart);

    res.json({ success: true, cart: updatedCart });
})

// DELETE ROUTES
// To delete cart
router.delete('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    
    const deletedCart = await Cart.delete(cartId);

    // console.log(deletedCart);

    res.status(200).json({ success: true, msg: "Cart deleted succesfully", cart_id: deletedCart.id });
})

router.use('/:cartId/checkout', require('./checkout'));

module.exports = router;