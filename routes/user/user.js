const express = require('express');
const router = express.Router();
const utils = require('../../lib/utils');
const User = require('../../models/User');
const { authenticateJWT } = require('../middlewares/authMiddleware');

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

// GET ROUTES
router.get('/', authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.json({ 
        success: true, 
        user: {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
        } 
    });
})

// PUT ROUTES
router.put('/', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { username, password, first_name, last_name } = req.body;

    // Make sure to submit the old password and the new password in the client side.
    // Password Validation
    if (!password) {
        return res.status(404).json({ success: false, msg: "Please provide current password before updating user details" });
    }

    const prevUser = await User.findById(userId);
    const isSamePassword = utils.validatePassword(password, prevUser.pw_hash, prevUser.pw_salt);

    // console.log(isSamePassword);
    if (isSamePassword) {
        return res.status(400).json({ success: false, msg: "Cannot change password to the current password" });
    }

    const newPassword = utils.genPassword(password);

    const data = {
        id: userId,
        // Making sure that if the provided input is null then put in the previous values.
        username: username ? username : prevUser.username,
        first_name: first_name ? first_name : prevUser.first_name, 
        last_name: last_name ? last_name : prevUser.last_name,
        pw_hash: newPassword.hash,
        pw_salt: newPassword.salt
    }

    const updatedUser = await User.update(data);

    res.json({ 
        success: true, 
        user: { 
            id: updatedUser.id,
            username: updatedUser.username,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name
        } 
    });
})

router.use('/address', require('./address'));

module.exports = router;