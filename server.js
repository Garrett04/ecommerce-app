const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const initializePassport = require('./passportConfig');

initializePassport(passport);

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
})

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})