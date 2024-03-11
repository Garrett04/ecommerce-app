const fs = require('fs');
const path = require('path');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../models/User');

const pathToKey = path.join(__dirname, '../..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (err) {
        done(err, null);
    }
})



module.exports = (passport) => {
    passport.use(jwtStrategy);
}