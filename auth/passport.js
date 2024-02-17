const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('../db/config');
const User = require('../models/User');
const { validatePassword } = require('../lib/passwordUtils');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findByUsername(username);
            
            // If no user was found then return done with no error and false.
            if (!user) { return done(null, false) }

            // To validate the password
            const isValid = validatePassword(password, user.hash, user.salt);
            
            // If user was found and the password was valid using the validPassword function 
            // then return done with no error and the user object.
            // Else return done with no error and no user object indicating wrong password. 
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        return done(null, user);
    } catch (err) {
        throw new Error(err);
    }
})

module.exports = passport;