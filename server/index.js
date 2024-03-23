const app = require('./app/app');
const PORT = process.env.PORT || 3000;
const { UUIDv4 } = require("uuid-v4-validator");


// Middleware to validate UUID parameters
app.use('/api/cart/:cartId', (req, res, next) => {
    const { cartId } = req.params; 

    if (cartId && !UUIDv4.validate(cartId)) {
        return res.status(400).json({ success: false, msg: "Invalid uuid" });
    }
    next();
})

// ROUTES
// Import all routes over here
app.use('/api', require('./routes/index'));

// Middleware to handle server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error: ' + err.message);
})

// Server listens on 10000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})