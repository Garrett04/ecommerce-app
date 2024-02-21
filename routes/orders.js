const router = require('express').Router();
const Order = require('../models/Order');
const { authenticateJWT, authOrderAccess } = require('./middlewares/authMiddleware');

/**
 * @swagger
 * definitions:
 *  Order:
 *      properties:
 *          id:
 *              type: integer
 *          user_id:
 *              type: integer
 *          order_date:
 *              type: string
 *          order_status:
 *              type: string
 *          checkout_id:
 *              type: integer
 */

// GET ROUTES
/**
 * @swagger
 * /api/orders:
 *  get:
 *      tags:
 *          - orders
 *      description: Finds orders by user id
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: An array of orders
 *              schema:
 *                  $ref: '#/definitions/Order'
 */
router.get('/', authenticateJWT, authOrderAccess, async (req, res) => {
    const userId = req.user.id;
    
    const orders = await Order.find(userId);

    if (!orders) {
        return res.status(404).json({ success: false, msg: "No orders found by user id" });
    }

    res.json({ success: true, orders: orders });
})

/**
 * @swagger
 * /api/orders/{orderId}:
 *  get:
 *      tags:
 *          - orders
 *      description: Finds order by order ID
 *      produces: application/json
 *      parameters:
 *          - name: orderId
 *            description: Order ID
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: A single order
 *              schema: 
 *                  $ref: '#/definitions/Order'
 */
router.get('/:orderId', authenticateJWT, authOrderAccess, async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ success: false, msg: "No order found by order id" });
    }

    res.json({ success: true, order: order });
})

module.exports = router;