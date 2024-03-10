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
 *          id: 1
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
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      user:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              username:
 *                                  type: string
 *                      token:
 *                          type: string
 *                      expiresIn:
 *                          type: string
 *                  example:
 *                      success: true
 *                      user:
 *                          id: 3
 *                          username: charlie
 *                      token:
 *                          Bearer <TOKEN>
 *                      expiresIn: 1d
 *          404:
 *              description: User not found
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: User not found
 *          500:
 *              description: Server error 
 */
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);

    if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" });
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
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      user:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              username:
 *                                  type: string
 *                      token:
 *                          type: string
 *                      expiresIn:
 *                          type: string
 *                  example:
 *                      success: true
 *                      user:
 *                          id: 4
 *                          username: charlie_new
 *                      token:
 *                          Bearer <TOKEN>
 *                      expiresIn: 1d
 *          409:
 *              description: User with username already exists
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: User with username already exists
 *          500: 
 *              description: Server error
 */
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    const saltHash = utils.genPassword(password);
    const { salt, hash } = saltHash;

    // Duplicate username check
    const userExists = await User.findByUsername(username);

    if (userExists) {
        return res.status(409).json({ success: false, msg: "User with username already exists" });
    }

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
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      user:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              username:
 *                                  type: string
 *                              first_name:
 *                                  type: string
 *                              last_name:
 *                                  type: string
 *                  example:
 *                      success: true
 *                      user:
 *                          id: 3
 *                          username: charlie
 *                          first_name: charlie
 *                          last_name: ali
 *          404:
 *              description: User not found
 *              schema:
 *                  type: object
 *                  properties:
 *                      success: 
 *                          type: string
 *                          example: false
 *                      msg:
 *                          type: string
 *                          example: User not found            
 *          401:
 *              description: Unauthorized       
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
 *      security:
 *          - bearerAuth: []
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
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      user:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              username:
 *                                  type: string
 *                              first_name:
 *                                  type: string
 *                              last_name:
 *                                  type: string
 *                  example:
 *                      success: true
 *                      user:
 *                          id: 3
 *                          username: charlie
 *                          first_name: charlie
 *                          last_name: ali
 *          400:
 *              description: Cannot change password to the current password
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: Cannot change password to the current password
 *          500:
 *              description: Server error
 */
router.put('/', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const { username, oldPassword, newPassword, first_name, last_name } = req.body;

    // Make sure to submit the old password and the new password in the client side.
    // Password Validation

    const prevUser = await User.findById(userId);
    const isSameOldPassword = utils.validatePassword(oldPassword, prevUser.pw_hash, prevUser.pw_salt);
    const isSamePassword = utils.validatePassword(newPassword, prevUser.pw_hash, prevUser.pw_salt);

    // console.log(isSamePassword);
    if (!isSameOldPassword) {
        return res.status(400).json({ success: false, msg: "Wrong Old Password entered" });
    } else if (isSamePassword) {
        return res.status(401).json({ success: false, msg: "Cannot change password to the current password" });
    }

    const password = utils.genPassword(newPassword);

    const data = {
        id: userId,
        // Making sure that if the provided input is null then put in the previous values.
        username: username ? username : prevUser.username,
        first_name: first_name ? first_name : prevUser.first_name, 
        last_name: last_name ? last_name : prevUser.last_name,
        pw_hash: password.hash,
        pw_salt: password.salt
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