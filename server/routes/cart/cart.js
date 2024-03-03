const router = require('express').Router();
const Cart = require('../../models/Cart');
const { 
    authenticateJWT, 
    authCartAccess
} = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *      name: cart
 *      description: The cart managing api
 */


/**
 * @swagger
 * definitions:
 *  Cart:
 *      required:
 *          - title
 *      properties:
 *          id:
 *              type: integer
 *          title:
 *              type: string
 *          user_id:
 *              type: integer
 *      example:
 *          id: 1
 *          title: Charlie's cart
 *          user_id: 1
 */

/**
 * @swagger
 * definitions:
 *  Carts_Products:
 *      type: array
 *      items:
 *          cart_id:
 *              type: integer
 *          user_id:
 *              type: integer
 *          carts_table_id:
 *              type: integer
 *          product_name:
 *              type: string
 *          product_quantity:
 *              type: integer
 *          product_price:
 *              type: string
 *      example:
 *          cart_id: 2
 *          user_id: 3
 *          carts_table_id: 2
 *          product_name: T-shirt
 *          product_quantity: 7
 *          product_price: $19.99
 */

// GET ROUTES
// To get cart by its id
/**
 * @swagger
 * /api/cart/{cartId}:
 *  get:
 *      tags:
 *          - cart
 *      summary: Retrieve cart by cart ID
 *      security:
 *          - bearerAuth: []
 *      description: Retrieve cart by cart ID
 *      parameters:
 *          - in: path
 *            name: cartId
 *            description: cart id
 *            required: true
 *      responses:
 *          200:
 *              description: Found cart by cart id
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      cart:
 *                          $ref: '#/definitions/Carts_Products'
 *          404:
 *              description: Cart not found
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: Cart not found
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: User not authorized to cart
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: User not authorized to cart
 */
router.get('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;

    // Calls findById which takes in an is_carts_table boolean value of false indicating to retrieve from the carts_products table
    const cart = await Cart.findById(false, cartId);

    if (!cart) {
        return res.status(404).json({ success: false, msg: "Cart not found" })
    }

    res.json({ success: true, cart: cart });
})

// POST ROUTES
// To create a new cart associated by user id
/**
 * @swagger
 * /api/cart:
 *  post:
 *      tags:
 *          - cart
 *      summary: Create a new cart associated by user id
 *      security:
 *          - bearerAuth: []
 *      description: Create a new cart associated by user id
 *      parameters:
 *          - in: body
 *            name: cart
 *            description: cart fields
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *              example:
 *                  title: Charlie's new cart
 *      responses:
 *          201:
 *              description: Successfully created
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      cart:
 *                          $ref: '#/definitions/Cart'
 *          404:
 *              description: Please provide the cart title
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: Please provide the cart title
 *          500:
 *              description: Server error
 */
router.post('/', authenticateJWT, async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    // console.log(userId);

    if (!title) {
        return res.status(400).json({ success: false, msg: "Please provide the cart title" });
    }

    const newCart = await Cart.create({ title, userId });

    res.status(201).json({ success: true, cart: newCart });
})

/**
 * @swagger
 * /api/cart/{cartId}:
 *  post:
 *      tags:
 *          - cart
 *      summary: Add product to cart by cart id
 *      security:
 *          - bearerAuth: []
 *      description: Add product to cart by cart id
 *      parameters:
 *          - in: path
 *            name: cartId
 *            description: cart id
 *            required: true
 *          - in: body
 *            name: product
 *            description: new product to add
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: integer
 *                  quantity:
 *                      type: integer
 *              example:
 *                  productId: 4
 *                  quantity: 3
 *      responses:
 *          200:
 *              description: Found cart by cart id
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      cart:
 *                          $ref: '#/definitions/Carts_Products'
 *          404:
 *              description: Please provide the productId and quantity
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: Please provide the productId and quantity
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: User not authorized to cart
 *              schema:
 *                  type: object
 *                  properties:
 *                      success:
 *                          type: boolean
 *                      msg:
 *                          type: string
 *                  example:
 *                      success: false
 *                      msg: User not authorized to cart
 */
// To add product to cart associated by cart id
router.post('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
        return res.status(404).json({ success: false, msg: "Please provide the product Id and quantity" });
    }

    const cart = await Cart.addProduct({ cartId, productId, quantity });

    res.status(201).json({success: true, cart: cart});
})

// PUT ROUTES
// To update cart details
/**
 * @swagger
 *  /api/cart/{cartId}:
 *      put:
 *          summary: To update cart details
 *          tags:
 *              - cart
 *          security:
 *              - bearerAuth: []
 *          description: Updates the cart details by cart id
 *          parameters:
 *              - in: path
 *                name: cartId
 *                description: Cart Id
 *                required: true
 *              - in: body
 *                name: cart
 *                description: cart fields to update
 *                required: true
 *                schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string
 *                  example:
 *                      title: Charlie's cart 2
 *          responses:
 *              200:
 *                  description: Cart updated succesfully
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                          cart:
 *                              $ref: '#/definitions/Cart'
 *              404:
 *                  description: Please provide the cart title
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                          msg:
 *                              type: string
 *                      example:
 *                          success: false
 *                          msg: Please provide the cart title
 *              401:
 *                  description: Unauthorized
 *              403:
 *                  description: Not authorized to cart
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                          msg:
 *                              type: string
 *                      example:
 *                          success: false
 *                          msg: Not authorized to cart
 *              500:
 *                  description: Server error  
 */
router.put('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(404).json({ success: false, msg: "Please provide the cart title" });
    }

    const updatedCart = await Cart.update({ id: cartId, title });

    // console.log("updatedCart:", updatedCart);

    res.json({ success: true, cart: updatedCart });
})

// DELETE ROUTES
// To delete cart
/**
 * @swagger
 *  /api/cart/{cartId}:
 *      delete:
 *          summary: To delete cart by cart id
 *          tags:
 *              - cart
 *          security:
 *              - bearerAuth: []
 *          description: Deletes cart by cart id
 *          parameters:
 *              - in: path
 *                name: cartId
 *                description: Cart id
 *                required: true
 *          responses:
 *              200:
 *                  description: Cart deleted successfully
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                          msg:
 *                              type: string
 *                          cart_id:
 *                              type: integer
 *                      example:
 *                          success: true
 *                          msg: Cart deleted successfully
 *                          cart_id: 3
 *              403:
 *                  description: Not authorized to cart
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                          msg:
 *                              type: string
 *                      example:
 *                          success: false
 *                          msg: Not authorized to cart
 *              401:
 *                  description: Unauthorized
 */
router.delete('/:cartId', authenticateJWT, authCartAccess, async (req, res) => {
    const { cartId } = req.params;
    
    const deletedCart = await Cart.delete(cartId);

    // console.log(deletedCart);

    res.status(200).json({ success: true, msg: "Cart deleted successfully", cart_id: deletedCart.id });
})

router.use('/:cartId/checkout', require('./checkout'));

module.exports = router;