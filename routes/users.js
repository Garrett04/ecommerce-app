const express = require('express');
const usersRouter = express.Router();

const { 
    findByUsername, 
    createUser, 
    updateUser
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

// Route to handle redirection of the users dashboard.
usersRouter.get('/dashboard', checkNotAuthenticated, (req, res) => {
    res.redirect(`/users/${req.user.id}/dashboard`);
})

usersRouter.get('/:userId/dashboard', (req, res) => {
    // If the userId parameter in the link is changed to any other number other than the user's
    // Then redirect the user to the dashboard with the correct user id.
    if (req.params.userId != req.user.id) {
        return res.redirect(`/users/${req.user.id}/dashboard`);
    }
    res.render('dashboard', { user: req.user.name, userId: req.user.id });
})

usersRouter.get('/:userId/edit-profile', (req, res) => {
    res.render('edit-profile', { 
        username: req.user.username, 
        userId: req.user.id
    });
})

usersRouter.get('/logout', (req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You have logged out');
        res.redirect('/users/login');
    });
})

// Registration of new users
usersRouter.post('/register', async (req, res, next) => {
    const { name, username, password, password2 } = req.body;
    let errors = [];

    const foundUser = await findByUsername(username);

    // Validation checks
    if (foundUser) {
        errors.push({ message: "User already exists. Try a different one" })
    }
    if (!name || !username || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password should have a minimum of 6 characters" });
    }
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }
    if (errors.length > 0) {
        res.render('register', { errors });
    } else {
        // Form validation has passed
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(name, username, hashedPassword);

        // res.json(newUser.rows[0]);
        req.flash('success_msg', 'You are now registered. Please log in.');
        res.redirect('/users/login');
    }
    // console.log(req.body);
})

// Login of users
usersRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
}));

// Modification of users details
usersRouter.put('/:userId/edit-profile', async (req, res) => {
    const { userId } = req.params;

    const { name, password, password2 } = req.body;
    let hashedPassword;

    // console.log(name, password, password2)

    // Validation checks
    const passwordCompare = await bcrypt.compare(password, req.user.password);

    // console.log(req.user.password, passwordCompare);
    
    if (!name && !password) {
        return res.status(400).send("Please provide new name or new password to update user info.");
    }

    if (!passwordCompare) {
        return res.render('edit-profile', { 
            username: req.user.username, 
            userId: req.user.id,
            wrongPassword: 'Please enter valid old password' 
        });
    } else {
        if (password2) {
            hashedPassword = await bcrypt.hash(password2, 10);
        }
    
        const updatedUser = await updateUser(userId, name, hashedPassword);
        
        // console.log(updatedUser);
        // res.status(201).json(updatedUser);

        res.render('dashboard', { 
            user: updatedUser.name, 
            userId: updatedUser.id,
            success_msg: "Profile updated successfully" 
        });
    }
    
})

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
    res.redirect('/users/login');
}

// Error handling for 500 server errors.
usersRouter.use((err, req, res, next) => {
    console.error('Error: ', err.message);
    res.status(500).send('Internal Server Error');
})

module.exports = usersRouter;