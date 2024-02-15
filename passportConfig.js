const LocalStrategy = require('passport-local').Strategy;
const { 
    findByUsername, findById 
} = require('./db/dbHelperFunctions');
const bcrypt = require('bcrypt');


function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await findByUsername(username);

        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
    
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Password is not correct" });
                }
            });
        } else {
            return done(null, false, { message: "Username is not registered" });
        }
    }

    passport.use(
        new LocalStrategy({
            usernameField: "username",
            passwordField: "password"
        }, authenticateUser 
    ));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
        const user = await findById(id);

        return done(null, user);
    })
}

module.exports = initialize;