const router = require('express').Router();
const Order = require('../models/Order');
const { authenticateJWT, authOrderAccess } = require('./middlewares/authMiddleware');

// GET ROUTES
router.get('/', authenticateJWT, authOrderAccess, async (req, res) => {
    const userId = req.user.id;
    
    const orders = await Order.find(userId);

    if (!orders) {
        return res.status(404).json({ success: false, msg: "No orders found by user id" });
    }

    res.json({ success: true, orders: orders });
})

router.get('/:orderId', authenticateJWT, authOrderAccess, async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ success: false, msg: "No order found by order id" });
    }

    res.json({ success: true, order: order });
})

module.exports = router;