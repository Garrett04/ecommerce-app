const express = require('express');
const usersRouter = express.Router();
const pool = require('../db/db');

// Registration of new users
usersRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1', 
            [username]
        );

        if (user.rows.length > 0) {
            return res.status(400).send("User already exists.");
        }

        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );

        res.json(newUser.rows[0]);

        // console.log(req.body);
    } catch (err) {
        console.error(err.message);
    }
})



module.exports = usersRouter;