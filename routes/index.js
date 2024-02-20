const router = require('express').Router();

// All routers over here
router.use('/users', require('./user'));
router.use('/products', require('./product'));
router.use('/cart', require('./cart'));

module.exports = router;