const passport = require('passport');
const Cart = require('../../models/Cart');

// Checks if user is authorized before proceeding to the requested route.
module.exports.authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next)
}

// Checks if user is authorized before accessing the cart.
module.exports.authCartAccess = async (req, res, next) => {
    const { cartId } = req.params;
    const userId = req.user.id;
    
    const cartExists = await Cart.findById(cartId);

    // console.log("cart user_id: ", cartExists.user_id);
    // console.log("userid: ", userId);

    if(cartExists.user_id !== userId) {
        return res.status(401).json({ success: false, msg: "Not authorized to cart" });
    }
    next();
}