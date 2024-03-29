const express = require('express');
const router = express.Router();
const utils = require('../../lib/utils');
const User = require('../../models/User');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const passport = require('passport');

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
router.get('/', isAuthenticated, async (req, res) => {
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
            last_name: user.last_name,
            login_method: user.login_method,
            default_shipping_address_id: user.default_shipping_address_id,
            default_billing_address_id: user.default_billing_address_id,
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
router.put('/', isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const { username, oldPassword, newPassword, first_name, last_name, login_method } = req.body;
    const prevUser = await User.findById(userId);

    // Checking if user's new username is exists in the database
    const usernameExists = await User.findByUsername(username);

    if (usernameExists) {
        return res.status(400).json({ 
            success: false, 
            msg: "Username already exists. Try a different one" 
        });
    }

    // for google users
    if (login_method === 'google') {
        const data = {
            id: userId,
            username: username ? username : prevUser.username,
            first_name: first_name ? first_name : prevUser.first_name, 
            last_name: last_name ? last_name : prevUser.last_name,
        }

        const updatedUser = await User.update(data);

        return res.json({ 
            success: true, 
            user: { 
                id: updatedUser.id,
                username: updatedUser.username,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name
            } 
        });
    }

    // for custom login users
    // Make sure to submit the old password and the new password in the client side.
    // Password Validation
    const isSameOldPassword = utils.validatePassword(oldPassword, prevUser.pw_hash, prevUser.pw_salt);
    const IsSameAsCurrentPassword = utils.validatePassword(newPassword, prevUser.pw_hash, prevUser.pw_salt);

    // console.log(IsSameAsCurrentPassword);
    if (!isSameOldPassword) {
        return res.status(400).json({ success: false, msg: "Wrong Old Password entered" });
    } else if (IsSameAsCurrentPassword) {
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

router.use('/addresses', require('./addresses'));

module.exports = router;