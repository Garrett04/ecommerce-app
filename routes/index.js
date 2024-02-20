const router = require('express').Router();

// All routers over here
router.use('/users', require('./user/user'));
router.use('/products', require('./product'));
router.use('/cart', require('./cart/cart'));

module.exports = router;