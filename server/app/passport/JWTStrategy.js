const fs = require('fs');
const path = require('path');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../../models/User');

const pathToKey = path.join(__dirname, '../..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        // console.log(req.cookies['accessToken']);
        token = req.cookies['accessToken'];
    }
    // console.log(token);
    return token;
};

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
}

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        console.log("hello");
        const user = await User.findById(payload.sub);
        console.log("hello", user);

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        done(err, null);
    }
})


module.exports = (passport) => {
    passport.use(jwtStrategy);
}