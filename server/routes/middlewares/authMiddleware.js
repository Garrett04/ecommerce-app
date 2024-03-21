const passport = require('passport');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const Address = require('../../models/Address');

// To authenticate the request using JWT strategy
// If authentication suceeds, user's information (i.e id) will be attached to the req.user property.
module.exports.isAuthenticated = (req, res, next) => {
    // console.log("hello from isAuthenticated");
    // Checks if there is a user session object i.e from google then proceed to next 
    // else check for jwt token
    if (req.user) {
        return next();
    } 
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.json({ success: false, authenticated: false });
        }
        req.user = user;
        return next();
    })(req, res, next)
}

// Checks if user is authorized before accessing carts_products.
module.exports.authCartAccess = async (req, res, next) => {
    const cartId = req.params.cartId || req.query.cart_id;
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
    
    // some error might happen here when creating addresses, updating or anything else
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