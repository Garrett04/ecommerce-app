const router = require('express').Router({ mergeParams: true });
const Cart = require('../../models/Cart');
const { authenticateJWT, authCartAccess, authAddressAccess } = require('../middlewares/authMiddleware');
const Checkout = require('../../models/Checkout');
const Order = require('../../models/Order');

/**
 * @swagger
 * definitions:
 *  Checkout:
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
 */

// POST ROUTES
// To validate if cart exists, then process the payment 
// and ensure payment details submitted are accurate.
/**
 * @swagger
 * /api/cart/{cartId}/checkout:
 *  post:
 *      tags:
 *          - cart
 *      description: Make a payment and an order
 *      parameters:
 *          - name: cartId
 *            in: path
 *            description: Cart ID
 *            required: true
 *          - name: checkout
 *            description: checkout object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Checkout'
 *      responses:
 *          201:
 *              description: Payment Successful
 */
router.post('/', authenticateJWT, authCartAccess, authAddressAccess, async (req, res) => {
    const { cartId } = req.params;
    const userId = req.user.id;
    const { 
        payment_method,
        shipping_address_id,
        billing_address_id 
    } = req.body;

    const paymentExists = await Checkout.checkPaymentExists(cartId);

    // console.log(paymentExists);

    if (paymentExists) {
        return res.status(400).json({ success: false, msg: "Payment already done" });
    }
    
    const newPaymentInfo = {
        cartId,
        payment_method,
        shipping_address_id,
        billing_address_id 
    }

    const makePayment = await Checkout.processPayment(newPaymentInfo);

    const {
        id,
        checkout_status
    } = makePayment;

    const makeOrder = await Order.create({ 
        user_id: userId, 
        checkout_id: id 
    });

    // console.log(makePayment);

    // console.log(cart);
    res.status(201).json({ 
        success: true, 
        checkout_status,
        order: makeOrder 
    });
})

module.exports = router;