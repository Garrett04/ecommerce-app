const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/config');

// const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(methodOverride('_method'));

// SESSION SETUP
app.use(session({
    secret: process.env.SECRET,
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
require('./auth/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    console.log(req.isAuthenticated());
    next();
});

// ROUTES
app.get('/', (req, res) => {
    res.render('index');
})

const authRouter = require('./routes/auth/auth');
app.use('/', authRouter);

// const userRouter = require('./routes/user');
// app.use('/users', userRouter);

// const productsRouter = require('./routes/product');
// app.use('/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})