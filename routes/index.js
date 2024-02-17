const router = require('express').Router();

// All routers over here
router.use('/users', require('./user'));
// router.use('/users', require('./user'));
// router.use('/products', require('./product'));

module.exports = router;