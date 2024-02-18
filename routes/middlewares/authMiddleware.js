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
    
    const cart = await Cart.findById(cartId);

    // console.log(cart);

    // If cart does not exist then return a 404 status code. 
    if (!cart) {
        return res.status(404).json({ success: false, msg: "Cart not found" });
    }

    // console.log("cart user_id: ", cart.user_id);
    // console.log("userid: ", userId);

    const hasCartAccess = cart.every(({user_id}) => {
        if (user_id === userId) {
            return true;
        } else {
            return false;
        }
    })

    // console.log(hasCartAccess);

    if(!hasCartAccess) {
        return res.status(401).json({ success: false, msg: "Not authorized to cart" });
    }
    next();
}