const router = require('express').Router();

// All routers over here
router.use('/auth', require('./auth'));
router.use('/users', require('./user/user'));
router.use('/categories', require('./category'));
router.use('/products', require('./product'));
router.use('/cart', require('./cart/cart'));
router.use('/orders', require('./orders'));

module.exports = router;