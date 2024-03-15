require('dotenv').config();
const router = require('express').Router({ mergeParams: true });
const Cart = require('../../models/Cart');
const { authenticateJWT, authCartAccess, authAddressAccess, isLoggedIn } = require('../middlewares/authMiddleware');
const Checkout = require('../../models/Checkout');
const Order = require('../../models/Order');
const User = require('../../models/User');

const stripe = require('stripe')(process.env.STRIPE_KEY);

/**
 * @swagger
 * definitions:
 *  Checkout:
 *      required:
 *          - payment_method
 *          - shipping_address_id
 *          - billing_address_id
 *      properties:
 *          id:
 *              type: integer
 *          payment_method:
 *              type: string
 *          shipping_address_id:
 *              type: integer
 *          billing_address_id:
 *              type: integer
 *          subtotal:
 *              type: float
 *          tax:
 *              type: float
 *          shipping_cost:
 *              type: float
 *          total_amount:
 *              type: float
 *          checkout_date:
 *              type: string
 *          checkout_status:
 *              type: string
 *          cart_id:
 *              type: integer
 *      example:
 *          id: 1
 *          payment_method: netbanking
 *          shipping_address_id: 2
 *          billing_address_id: 3
 *          subtotal: 100.15
 *          tax: null
 *          shipping_cost: null
 *          total_amount: 100.15
 *          checkout_date: 2023-10-15
 *          checkout_status: success
 *          cart_id: 1
 */

// POST ROUTES
// To validate if cart exists, then process the payment using Stripe.
router.post('/create-checkout-session', authenticateJWT, isLoggedIn, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const userId = req.user.id;

    const cart_products = await Cart.findById(false, cartId);

    const line_items = cart_products.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product_name,
                    metadata: {
                        id: item.product_id
                    }
                },
                unit_amount: item.product_price.replace('$', '') * 100, // Removing dollar sign
            },
            quantity: item.product_quantity
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        // This is where the session_id is stored for later retrieval
        success_url: `http://localhost:3001/carts/${cartId}/checkout/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3001/carts/${cartId}`,
    })
    
    // To get user's default shipping and billing address id 
    const user = await User.findById(userId);

    const data = {
        sessionId: session.id,
        cartId,
        checkout_status: session.payment_status,
        payment_method: "card",
        shipping_address_id: user.default_shipping_address_id,
        billing_address_id: user.default_billing_address_id, 
    }

    const makePayment = await Checkout.processPayment(data);

    console.log(makePayment);

    res.send({ url: session.url });
})

// To update checkout status and make an order using a query param which holds the stripe session_id
// Then return a 200 if successful with a checkout object and order object.
router.put('/checkout-success', authenticateJWT, isLoggedIn, authCartAccess, async (req, res) => {
    const userId = req.user.id;
    const { session_id } = req.query;

    // Retrieve stripe session to check if payment is done
    // console.log(session_id)
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // use stripe to get payment_status
    console.log(session.payment_status);

    const data = {
        stripe_session_id: session_id,
        checkout_status: session.payment_status
    }

    // If payment is not successful then return a 400 status code and some message
    if (session.payment_status !== 'paid') {
        return res.status(400).json({ success: false, msg: "Payment not successful" });
    }

    // If payment is successful then change payment status and make an order
    const updatedCheckoutStatus = await Checkout.updateCheckoutStatus(data);

    const makeOrder = await Order.create({ 
        user_id: userId, 
        checkout_id: updatedCheckoutStatus.id
    });

    res.status(200).json({ success: true, checkout: updatedCheckoutStatus, order: makeOrder });
})

module.exports = router;