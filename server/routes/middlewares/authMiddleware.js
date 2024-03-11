const passport = require('passport');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const Address = require('../../models/Address');

// Checks if user is authorized before proceeding to the requested route.
module.exports.authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next)
}

// Checks if user is authorized before accessing carts_products.
module.exports.authCartAccess = async (req, res, next) => {
    const { cartId } = req.params;
    const userId = req.user.id;
    let hasCartAccess;

    // console.log('from authCartAccess');
    
    // Retrieving from carts table
    const cart = await Cart.findById(true, cartId);


    // console.log("cart:", cart);

    // If cart does not exist then return a 404 status code. 
    if (!cart) {
        return res.status(404).json({ success: false, msg: "Cart not found" });
    }

    // console.log("cart user_id: ", cart.user_id);
    // console.log("userid: ", userId);

    hasCartAccess = cart.user_id === userId ? true : false;

    // console.log(hasCartAccess);

    if(!hasCartAccess) {
        return res.status(403).json({ success: false, msg: "Not authorized to cart" });
    }

    next();
}

module.exports.authAddressAccess = async (req, res, next) => {
    const userId = req.user.id;

    const addressExists = await Address.findByUserId(userId);
    
    if (!addressExists) {
        return res.status(401).json({ success: false, msg: "Not authorized to use address" });
    }

    next();
}

module.exports.authOrderAccess = async (req, res, next) => {
    const userId = req.user.id;

    const order = await Order.find(userId);

    if (!order) {
        return res.status(401).json({ msg: false, msg: "Not authorized to order" });
    }

    next();
}

// To check if logged in using google
module.exports.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.sendStatus(401);
}