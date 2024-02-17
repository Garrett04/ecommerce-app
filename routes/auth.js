const express = require('express');
const router = express.Router();
const { genPassword } = require('../lib/passwordUtils');
const passport = require('passport');
const User = require('../models/User');

// GET ROUTES
router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

// temporary route
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.user.username });
})

// POST ROUTES
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    
    const saltHash = genPassword(password);

    console.log(saltHash);
    const { salt, hash } = saltHash;

    const userExists = await User.findByUsername(username);
    
    if (userExists) {
        return res.send('User already exits');
    }

    const newUser = await User.create({ username, hash, salt });

    console.log(newUser);
    res.redirect('/login');
})


module.exports = router;