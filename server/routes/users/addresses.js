const router = require('express').Router({ mergeParams: true });
const { isAuthenticated, authAddressAccess } = require('../middlewares/authMiddleware');
const Address = require('../../models/Address');
const User = require('../../models/User');

/**
 * @swagger
 * tags:
 *      name: addresses
 *      description: The address managing api
 */

// Gets all addresses by user id
router.get('/', isAuthenticated, async (req, res) => {
    const userId = req.user.id;

    const addresses = await Address.findByUserId(userId);

    if (!addresses) {
        return res.status(404).json({ success: false, msg: "No addresses found" });
    }

    res.json({ success: true, addresses });
})

/**
 * @swagger
 * definitions:
 *  Address:
 *      required:
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
 *              $ref: '#/definitions/User/example/id'
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
 * 
 *  AddressRequestBody:
 *      type: object
 *      properties:
 *          address_line1:
 *              type: string
 *              example:
 *                  $ref: '#/definitions/Address/example/address_line1'
 *          address_line2:
 *              type: string
 *              example:
 *                  $ref: '#/definitions/Address/example/address_line2'
 *          city:
 *              type: string
 *              example:
 *                  $ref: '#/definitions/Address/example/city'
 *          state:
 *              type: string
 *              example: 
 *                  $ref: '#/definitions/Address/example/state'
 *          postal_code:
 *              type: string
 *              example:
 *                  $ref: '#/definitions/Address/example/postal_code'
 *          country:
 *              type: string
 *              example:    
 *                  $ref: '#/definitions/Address/example/country'
 */


//POST ROUTES
// To add user address
/**
 * @swagger
 * /api/users/addresses/add-address:
 *  post:
 *      tags:
 *          - address
 *      summary: Creates a new address
 *      security:
 *          - bearerAuth: []
 *      description: Creates a new address
 *      parameters:
 *          - name: address
 *            description: address object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/AddressRequestBody'
 *      responses:
 *          201:
 *              description: Address created successfully
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      address:
 *                          $ref: '#/definitions/Address'
 *          401:
 *              description: Unauthorized
 */
router.post('/add-address', isAuthenticated, async (req, res) => {
    const userId = req.user.id;

    const data = {
        user_id: userId,
        ...req.body
    }

    // console.log(data);

    const newAddress = await Address.create(data);

    res.status(201).json({ success: true, address: newAddress });
})

/**
 * @swagger
 * /api/users/addresses/{addressId}:
 *  delete:
 *      tags:
 *          - address
 *      summary: Deletes an address by address id
 *      security:
 *          - bearerAuth: []
 *      description: Deletes an address by address id
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: addressId
 *            description: Address id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: Address deleted successfully
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                      address_id:
 *                          type: integer
 *                  example:
 *                      success: true
 *                      msg: Address deleted succesfully
 *                      address_id: 1
 *          404:
 *              description: Address not found
 *              schema:
 *                  type: Object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: Address not found
 *          401:
 *              description: Unauthorized
 */
// To delete user address
router.delete('/:addressId', isAuthenticated, authAddressAccess, async (req, res) => {
    const { addressId } = req.params;

    const deletedAddressId = await Address.delete(addressId);

    if (!deletedAddressId) {
        return res.status(404).json({ success: false, msg: "Address not found" });
    } 

    res.status(200).json({ 
        success: true, 
        msg: "Address deleted succesfully", 
        address_id: deletedAddressId
    });
})

/**
 * @swagger
 * /api/users/addresses/{addressId}:
 *  put:
 *      tags:
 *          - address
 *      summary: Updates a user's address
 *      security:
 *          - bearerAuth: []
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
 *              $ref: '#/definitions/AddressRequestBody'
 *      responses:
 *          200:
 *              description: Successfully updated
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      address:
 *                          $ref: '#/definitions/Address'
 *          404:
 *              description: Address not found
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: Address not found
 *          401:
 *              description: Unauthorized
 */
// PUT ROUTES
router.put('/:addressId', isAuthenticated, authAddressAccess, async (req, res) => {
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

// To update default_shipping_address_id or default_billing_address_id in the addresses table
router.put('/update-default-address/:addressId', isAuthenticated, authAddressAccess, async (req, res) => {
    const userId = req.user.id;
    const { addressId } = req.params;
    // Holds the value of which address is to be default either default-shipping-address or default-billing-address
    const { option } = req.body;

    // console.log(option);

    const prevUser = await User.findById(userId);

    let data;
    if (option === 'default-shipping-address') {
        data = {
            userId,
            default_shipping_address_id: addressId,
            // Ensuring this is kept as previous setting
            default_billing_address_id: prevUser.default_billing_address_id,
        }
    } else if (option === 'default-billing-address') {
        data = {
            userId,
            default_billing_address_id: addressId,
            // Ensuring this is kept as previous setting
            default_shipping_address_id: prevUser.default_shipping_address_id
        }
    }

    // console.log(data);
    const updatedAddress = await User.updateDefaults(data);

    if (!updatedAddress) {
        return res.status(404).json({ success: false, msg: "Address not found" });
    }

    res.json({ success: true, address: updatedAddress })
})

module.exports = router;