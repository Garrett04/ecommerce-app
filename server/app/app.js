const express = require('express');
const cors = require('cors');
const app = express();

const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('../db/config');
const { authenticateJWT } = require('../routes/middlewares/authMiddleware');

// just like body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS SETUP
app.use(cors({
    origin: "http://localhost:3001",
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
        maxAge: 1000 * 60 * 60 * 24 // 1 day (1 day * 24 hr/1 day * 60 min/1 hr
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