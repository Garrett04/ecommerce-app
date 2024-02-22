const express = require('express');
const router = express.Router();
const utils = require('../../lib/utils');
const User = require('../../models/User');
const { authenticateJWT } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *      name: users
 *      description: The users managing api
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     required:
 *          - username
 *          - password
 *     properties:
 *          id:
 *              type: integer
 *          username:
 *              type: string
 *          password:
 *              type: string
 *          first_name:
 *              type: string
 *          last_name:
 *              type: string
 *     example:
 *          username: "charlie"
 *          password: "123"
 *          first_name: Charlie
 *          last_name: Ali
 */


// POST ROUTES
/**
 * @swagger
 * /api/users/login:
 *  post:
 *      tags:
 *          - users
 *      summary: Retrieve user information along with bearer token
 *      description: Logs user into the system
 *      parameters:
 *          - name: user
 *            description: User object
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      example: 
 *                          $ref: '#/definitions/User/example/username'
 *                  password:
 *                      type: string
 *                      example:
 *                          $ref: '#/definitions/User/example/password'
 *      responses:
 *          200:
 *              description: Successfully logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#definitions/User'
 *          500:
 *              description: Server error 
 */
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);

    if (!user) {
        res.status(401).json({ success: false, msg: "could not find user" });
    }

    const isValid = utils.validatePassword(password, user.pw_hash, user.pw_salt);

    if (isValid) {

        const tokenObject = utils.issueJWT(user);
        res.json({ 
            success: true, 
            user: {
                id: user.id,
                username: user.username
            }, 
            token: tokenObject.token, 
            expiresIn: tokenObject.expires 
        });

    } else {
        res.status(401).json({ success: false, msg: "you entered the wrong password" });
    }
})

/**
 * @swagger
 * /api/users/register:
 *  post:
 *      tags:
 *          - users
 *      summary: Creates a new user
 *      description: Creates a new user
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: new user fields
 *            description: User object
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      example:
 *                          $ref: '#/definitions/User/example/username'
 *                  password:
 *                      type: string
 *                      example:
 *                          $ref: '#/definitions/User/example/password'
 *      responses:
 *          200:
 *              description: Successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/User'
 *          500: 
 *              description: Server error
 */
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const saltHash = utils.genPassword(password);
    const { salt, hash } = saltHash;

    const newUser = await User.create({ username, hash, salt });
    const jwt = utils.issueJWT(newUser);

    res.json({ 
        success: true, 
        user: {
            id: newUser.id,
            username: newUser.username
        }, 
        token: jwt.token, 
        expiresIn: jwt.expires 
    })
    // console.log(newUser);
})

// GET ROUTES
/**
 * @swagger
 * /api/users:
 *  get:
 *      tags:
 *          - users
 *      summary: Returns user information
 *      security:
 *          - bearerAuth: []
 *      description: Returns user information
 *      responses:
 *          200:
 *              description: An object of the user information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/User'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Unauthorized                      
 */
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
/**
 * @swagger
 * /api/users:
 *  put:
 *      tags:
 *          - users
 *      summary: Updates a user's information
 *      description: Updates a user's information
 *      parameters:
 *          - name: user fields to change
 *            in: body
 *            description: Fields for the user resource
 *            required: true
 *            schema:
 *              type: object
 *              $ref: '#/definitions/User'
 *      responses:
 *          200:
 *              description: Successfully updated
 *              content:
 *                  application/json:
 *                      $ref: '#/definitions/User'
 *          500:
 *              description: Server error
 */
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