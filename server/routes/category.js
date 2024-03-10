const router = require('express').Router();
const Category = require('../models/Category');

// Gets categories
router.get('/', async (req, res) => {
    const categories = await Category.find();

    if (!categories) {
        return res.status(404).json({ success: false, msg: "No categories found" });
    }

    res.json({ success: true, categories });
})

module.exports = router;