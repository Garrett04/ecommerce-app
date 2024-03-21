const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('./middlewares/authMiddleware');
const User = require('../models/User');
const utils = require('../lib/utils');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *  name: auth
 *  description: The auth managing api
 */

// POST ROUTES
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *      tags:
 *          - auth
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

    // if password is valid then issue a JWT token 
    if (isValid) {

        // console.log(user);

        // Issuance of JWT
        const { token, expires } = utils.issueJWT(user);

        // Set JWT token in an HTTPonly cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                username: user.username
            }
        });

    } else {
        res.status(401).json({ success: false, msg: "you entered the wrong password" });
    }
})

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      tags:
 *          - auth
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

    const newUser = await User.create({ username, hash, salt, login_method: 'custom' });
    
    // Issuance of token
    const { token } = utils.issueJWT(newUser);

    res.cookie('accessToken', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    res.json({ 
        success: true, 
        user: {
            id: newUser.id,
            username: newUser.username,
        }
    })
    // console.log(newUser);
})

// Google OAuth2
router.get('/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: `${process.env.CLIENT_URL}/`,
        failureRedirect: `${process.env.CLIENT_URL}/login`
    })
)

// Returns the google user object, and a JWT token
router.get('/login/success', isAuthenticated, async (req, res) => {
    const user = req.user;

    // console.log('hello')

    const userDetails = await User.findById(user.id);

    res.status(200).json({
        success: true,
        user: {
            id: userDetails.id,
            username: userDetails.username,
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            default_shipping_address_id: userDetails.default_shipping_address_id,
            default_billing_address_id: userDetails.default_billing_address_id,
            login_method: userDetails.login_method
        }
    })
})

// Logs out the user
router.post('/logout', isAuthenticated, (req, res, next) => {
    // checks if user has accessToken cookie then log out that user.
    if (req.cookies && req.cookies.accessToken) {
        res.clearCookie('accessToken');
        return res.json({ success: true, msg: "Successfully logged out" });
    }

    // checks for if its a Google user then log out that user.
    if (req.user) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            return res.json({ success: true, msg: "Successfully logged out" });
        });
    }
})

// Check if user is authenticated
router.get('/check-authentication', isAuthenticated, (req, res) => {
    res.json({ success: true, authenticated: true })
})

module.exports = router;