const passport = require('passport');
const User = require('../../models/User');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
        // const user = await User.findById({ googleId: profile.id });
        // console.log(profile);
        const user = await User.findOrCreate({ 
            googleId: profile.id, 
            username: profile.email, 
            first_name: profile.given_name, 
            last_name: profile.family_name,
            login_method: 'google'
        });

        if (user) {
            // console.log(user);
            return done(null, user);
        }

    } catch (err) {
        done(err, null);
    }
  }
);

passport.serializeUser((user, done) => {
    return done(null, user);
})

passport.deserializeUser((user, done) => {
    return done(null, user);
})

module.exports = (passport) => {
    passport.use(googleStrategy);
}
