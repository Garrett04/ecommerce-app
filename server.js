const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const passport = require('passport');
const session = require('express-session');
const genFunc = require('connect-pg-simple');
const { connectionString } = require('./db/config');

// const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(methodOverride('_method'));

// SESSION SETUP
const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
    conString: connectionString
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day (1 day * 24 hr/1 day * 60 min/1 hr
    }
}));

// PASSPORT AUTHENTICATION
require('./auth/passport');

app.use(passport.initialize());
app.use(passport.session());

// app.set('view engine', 'ejs');

// ROUTES
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// const userRouter = require('./routes/user');
// app.use('/users', userRouter);

// const productsRouter = require('./routes/product');
// app.use('/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})