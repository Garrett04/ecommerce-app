const passport = require('passport');

// Checks if user is authorized before proceeding to the requested route.
module.exports.authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next)
}