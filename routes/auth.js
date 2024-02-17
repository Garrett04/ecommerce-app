const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

authRouter.post('/login', passport.authenticate('local'), (req, res, next) => {})


module.exports = authRouter;