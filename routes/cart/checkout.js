const router = require('express').Router({ mergeParams: true });
const Cart = require('../../models/Cart');
const { authenticateJWT, authCartAccess } = require('../middlewares/authMiddleware');
const Checkout = require('../../models/Checkout');

// POST ROUTES
// To validate if cart exists, then process the payment 
// and ensure payment details submitted are accurate.
router.post('/', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const { 
        payment_method,
        shipping_address_id,
        billing_address_id 
    } = req.body;
    
    const newPaymentInfo = {
        cartId,
        payment_method,
        shipping_address_id,
        billing_address_id 
    }

    const makePayment = await Checkout.processPayment(newPaymentInfo);

    // console.log(makePayment);

    // console.log(cart);
    res.status(201).json(makePayment);
})

module.exports = router;