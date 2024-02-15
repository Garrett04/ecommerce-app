const express = require('express');
const usersRouter = express.Router();

const { 
    findByUsername, 
    createUser 
} = require('../db/dbHelperFunctions');

const bcrypt = require('bcrypt');

// Registration of new users
usersRouter.post('/register', async (req, res, next) => {
    try {
        const { name, username, password } = req.body;

        const foundUser = await findByUsername(username);

        if (foundUser) {
            return res.status(400).send('User already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(name, username, hashedPassword);

        res.json(newUser.rows[0]);

        // console.log(req.body);
    } catch (err) {
        next(err);
    }
})

// Login of users
usersRouter.post('/login', (req, res) => {
    
});

// Error handling for 500 server errors.
usersRouter.use((err, req, res, next) => {
    console.error('Error: ', err.message);
    res.status(500).send('Internal Server Error');
})

module.exports = usersRouter;