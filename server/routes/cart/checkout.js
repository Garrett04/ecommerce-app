require('dotenv').config();
const router = require('express').Router({ mergeParams: true });
const Cart = require('../../models/Cart');
const { isAuthenticated, authCartAccess, authAddressAccess } = require('../middlewares/authMiddleware');
const Checkout = require('../../models/Checkout');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Address = require('../../models/Address');

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
router.post('/create-checkout-session', isAuthenticated, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const userId = req.user.id;

    const cart_products = await Cart.findById(false, cartId);

    const line_items = cart_products.map(item => {
        const price_in_cents = Math.round(parseFloat(item.product_price.replace('$', '')) * 100); // Converting dollars to cents
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product_name,
                    metadata: {
                        id: item.product_id
                    }
                },
                unit_amount: price_in_cents, 
            },
            quantity: item.product_quantity
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        // This is where the session_id is stored for later retrieval
        success_url: `${process.env.CLIENT_URL}/carts/${cartId}/checkout/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/carts/${cartId}`,
    })
    
    // To get user's default shipping and billing address id 
    const user = await User.findById(userId);

    // To get all the address details from the id of the default addresses
    const shipping_address = await Address.find(user.default_shipping_address_id);
    const billing_address = await Address.find(user.default_billing_address_id);

    // To store the shipping address in an object format
    const shipping_address_data = {
        address_line1: shipping_address.address_line1,
        address_line2: shipping_address.address_line2,
        country: shipping_address.country,
        state: shipping_address.state,
        city: shipping_address.city,
        postal_code: shipping_address.postal_code
    }

    // To store the billing address in an object format
    const billing_address_data = {
        address_line1: billing_address.address_line1,
        address_line2: billing_address.address_line2,
        country: billing_address.country,
        state: billing_address.state,
        city: billing_address.city,
        postal_code: billing_address.postal_code
    }

    const data = {
        sessionId: session.id,
        cartId,
        checkout_status: session.payment_status,
        payment_method: "card",
        shipping_address: shipping_address_data,
        billing_address: billing_address_data
    }

    const makePayment = await Checkout.processPayment(data);

    // console.log(makePayment);

    res.send({ url: session.url });
})

// To update checkout status and make an order using a query param which holds the stripe session_id
// Then return a 200 if successful with a checkout object and order object.
router.put('/checkout-success', isAuthenticated, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const userId = req.user.id;
    const { session_id } = req.query;

    // checking if order exists by session_id
    const orderExists = await Order.findOrderBySessionId(session_id);

    // if order exists then return a false message with the order
    if (orderExists) {
        return res.status(400).json({ 
            success: false, 
            orderId: orderExists.order_id,
            msg: "Order already exists" 
        });    
    }

    // Retrieve stripe session to check if payment is done
    // console.log(session_id)
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // Retrieve cart details again to later permanantly save a jsonb object to the orders db  
    const cart = await Cart.findById(false, cartId)

    // use stripe to get payment_status
    // console.log(session.payment_status);
    // console.log(cart);

    // Destruct the first row cart_title since all rows will have same title
    const { cart_title } = cart[0];

    // Map through cart array and save all necessary values to cart_items
    const cart_items = cart.map(item => {
        return {
            product_id: item.product_id,
            product_name: item.product_name,
            product_price: item.product_price,
            product_quantity: item.product_quantity
        }
    })

    const cart_details = {
        cart_title,
        cart_items
    }

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
        checkout_id: updatedCheckoutStatus.id,
        cart_id: cartId,
        cart_details
    });

    res.status(200).json({ success: true, checkout: updatedCheckoutStatus, order: makeOrder });
})

module.exports = router;