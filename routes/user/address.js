const router = require('express').Router({ mergeParams: true });
const { authenticateJWT, authAddressAccess } = require('../middlewares/authMiddleware');
const Address = require('../../models/Address');

//POST ROUTES
// To add user address
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