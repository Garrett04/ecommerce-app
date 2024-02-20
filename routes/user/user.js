const express = require('express');
const router = express.Router();
const utils = require('../../lib/utils');
const User = require('../../models/User');
const Address = require('../../models/Address');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// GET ROUTES
router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})

// temporary routes
router.get('/dashboard', authenticateJWT, (req, res) => {
    // res.render('dashboard', { user: req.user.username });
    res.json({ success: true, msg: "You are now authorised", user: req.user });
})

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) { return next(err) }
        res.redirect('/');
    });
})

// POST ROUTES
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);

    if (!user) {
        res.status(401).json({ success: false, msg: "could not find user" });
    }

    const isValid = utils.validatePassword(password, user.pw_hash, user.pw_salt);

    if (isValid) {

        const tokenObject = utils.issueJWT(user);
        res.json({ success: true, user: user, token: tokenObject.token, expiresIn: tokenObject.expires });

    } else {
        res.status(401).json({ success: false, msg: "you entered the wrong password" });
    }
})

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const saltHash = utils.genPassword(password);
    const { salt, hash } = saltHash;

    const newUser = await User.create({ username, hash, salt });
    const jwt = utils.issueJWT(newUser);

    res.json({ success: true, user: newUser, token: jwt.token, expiresIn: jwt.expires })
    // console.log(newUser);
})

router.use('/address', require('./address'));


module.exports = router;