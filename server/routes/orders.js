const router = require('express').Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { isAuthenticated, authOrderAccess } = require('./middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *  name: orders
 *  description: The orders managing api
 */


/**
 * @swagger
 * definitions:
 *  Order:
 *      type: object
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
 *      example:
 *          id: 5
 *          user_id: 1
 *          order_date: 2024-02-20
 *          order_status: success
 *          checkout_id: 12
 */


// GET ROUTES
/**
 * @swagger
 * /api/orders:
 *  get:
 *      tags:
 *          - orders
 *      summary: Find all orders by user id
 *      security:
 *          - bearerAuth: []
 *      description: Find all orders by user id
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: An array of orders
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      orders:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                  user_id:
 *                                      type: integer
 *                                  order_date:
 *                                      type: string
 *                                      format: date-time
 *                                  order_status:
 *                                      type: string
 *                                  checkout_id:
 *                                      type: integer
 *                  example:
 *                      success: true
 *                      orders:
 *                          - id:  5
 *                            user_id: 1
 *                            order_date: 2024-02-20T00:00:00.000Z
 *                            order_status: success
 *                            checkout_id: 12
 *          404:
 *              description: No orders found by user id
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: No orders found by user id
 *          401:
 *              description: Unauthorized
 */
router.get('/', isAuthenticated, isAuthenticated, authOrderAccess, async (req, res) => {
    const userId = req.user.id;
    
    const orders = await Order.find(userId);

    if (!orders) {
        return res.status(404).json({ success: false, msg: "No orders found by user id" });
    }

    // console.log(orders);

    res.json({ 
        success: true, 
        orders: orders
    });
})

/**
 * @swagger
 * /api/orders/{orderId}:
 *  get:
 *      tags:
 *          - orders
 *      summary: Finds order by order id
 *      security:
 *          - bearerAuth: []
 *      description: Finds order by order id
 *      parameters:
 *          - name: orderId
 *            description: Order id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: A single order
 *              schema: 
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      order:
 *                          $ref: '#/definitions/Order'
 *              examples:
 *                  success: true
 *                  order:
 *                      $ref: '#/definitions/Order'
 *          404:
 *              description: No order found by order id
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: No order found by order id
 *          401:
 *              description: Unauthorized
 */
router.get('/:orderId', isAuthenticated, isAuthenticated, authOrderAccess, async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ success: false, msg: "No order found by order id" });
    }

    // Get the total_amount and order_status by putting in the cart_id from the orders table rows. 
    // selecting the first row since all will be the same
    const { total_amount, order_status } = order[0];

    res.json({ 
        success: true, 
        order: order, 
        total_amount: total_amount,
        order_status: order_status
    });
})

module.exports = router;