const router = require('express').Router({ mergeParams: true });
const { authenticateJWT, authAddressAccess } = require('../middlewares/authMiddleware');
const Address = require('../../models/Address');

/**
 * @swagger
 * tags:
 *      name: address
 *      description: The address managing api
 */

/**
 * @swagger
 * definitions:
 *  Address:
 *      required:
 *          - user_id
 *          - address_line1
 *          - address_line2
 *          - city
 *          - state
 *          - postal_code
 *          - country
 *      properties:
 *          id: 
 *              type: integer
 *          user_id:
 *              type: integer
 *          address_line1:
 *              type: string
 *          address_line2:
 *              type: string
 *          city:
 *              type: string
 *          state:
 *              type: string
 *          postal_code:
 *              type: string
 *          country:
 *              type: string
 *      example:
 *          id: 2
 *          user_id: 1
 *          address_line1: 24212
 *          address_line2: Mariano Place
 *          city: Konopelskimouth
 *          state: Connecticut
 *          postal_code: 61148
 *          country: Austria
 */

//POST ROUTES
// To add user address
/**
 * @swagger
 * /api/users/address/add-address:
 *  post:
 *      tags:
 *          - address
 *      summary: Creates a new address
 *      description: Creates a new address
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: address
 *            description: address object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Address'
 */
router.post('/add-address', authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    const data = {
        user_id: userId,
        ...req.body
    }

    // console.log(data);

    const newAddress = await Address.create(data);

    res.status(201).json({ status: true, address: newAddress });
})

/**
 * @swagger
 * /api/users/address/{addressId}:
 *  delete:
 *      tags:
 *          - address
 *      summary: Deletes a single address
 *      description: Deletes a single address
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: addressId
 *            description: Address ID
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: Successfully deleted  
 */
// To delete user address
router.delete('/:addressId', authenticateJWT, authAddressAccess, async (req, res) => {
    const { addressId } = req.params;

    const deletedAddressId = await Address.delete(addressId);

    if (!deletedAddressId) {
        return res.status(404).json({ success: false, msg: "Address not found" });
    } 

    res.status(200).json({ 
        success: true, 
        msg: "Address deleted succesfully.", 
        address_id: deletedAddressId
    });
})

/**
 * @swagger
 * /api/users/address/{addressId}:
 *  put:
 *      tags:
 *          - address
 *      summary: Updates a user's address
 *      description: Updates a user's address
 *      produces: application/json
 *      parameters:
 *          - name: addressId
 *            in: path
 *            description: address ID
 *            required: true
 *          - name: address fields
 *            in: body
 *            description: Fields for the address resource
 *            required: true
 *            schema:
 *              type: object
 *              $ref: '#/definitions/Address'
 *      responses:
 *          200:
 *              description: Successfully updated
 */
// PUT ROUTES
router.put('/:addressId', authenticateJWT, authAddressAccess, async (req, res) => {
    const { addressId } = req.params;
    
    const data = {
        id: addressId,
        ...req.body
    };

    const updatedAddress = await Address.update(data);

    if (!updatedAddress) {
        return res.status(404).json({ success: false, msg: "Address not found" });
    }

    res.json({ success: true, address: updatedAddress });
})

module.exports = router;