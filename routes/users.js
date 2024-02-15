const express = require('express');
const usersRouter = express.Router();

const { 
    findByUsername, 
    createUser 
} = require('../db/dbHelperFunctions');

const bcrypt = require('bcrypt');
const passport = require('passport');

// Render views
usersRouter.get('/register', checkAuthenticated, (req, res) => {
    res.render('register');
})

usersRouter.get('/login', checkAuthenticated, (req, res) => {
    res.render('login');
})

usersRouter.get('/dashboard', checkNotAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user.name })
})

// Registration of new users
usersRouter.post('/register', async (req, res, next) => {
    const { name, username, password, password2 } = req.body;
    let errors = [];

    try {
        // Validation checks
        if (!name || !username || !password || !password2) {
            errors.push({ error: "Please enter all fields" });
        }

        if (password.length < 6) {
            errors.push({ error: "Password should have a minimum of 6 characters" });
        }
        
        if (password !== password2) {
            errors.push({ error: "Passwords do not match" });
        }

        if (errors.length > 0) {
            res.render('register', { errors });
        } else {
            // Form validation has passed
            const foundUser = await findByUsername(username);

            if (foundUser) {
                return res.status(400).send('User already exists.');
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = await createUser(name, username, hashedPassword);
    
            // res.json(newUser.rows[0]);
            req.flash('success_msg', 'You are now registered. Please log in.');
            res.redirect('/users/login');
        }
        // console.log(req.body);
    } catch (err) {
        next(err);
    }
})

// Login of users
usersRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}));

// Middlewares to check if the user is first authenticated before going to specific routes
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/dashboard');
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Error handling for 500 server errors.
usersRouter.use((err, req, res, next) => {
    console.error('Error: ', err.message);
    res.status(500).send('Internal Server Error');
})

module.exports = usersRouter;