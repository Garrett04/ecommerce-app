const express = require('express');
const cors = require('cors');
const app = express();

const passport = require('passport');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('../db/config');
const { isAuthenticated } = require('../routes/middlewares/authMiddleware');

// just like body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS SETUP
app.use(cors({
    origin: [ process.env.CLIENT_URL, 'http://localhost:3001' ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));

// SWAGGER SETUP
app.use(require('./swagger'));

// SESSION SETUP
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
        pool,
        tableName: 'session'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true
    }
}));

// PASSPORT AUTHENTICATION
// Passes the global passport object into the configuration functions.
require('./passport/JWTStrategy')(passport);
require('./passport/googleStrategy')(passport);

// Initialization of passport on every request
app.use(passport.initialize());
app.use(passport.session());


module.exports = app;