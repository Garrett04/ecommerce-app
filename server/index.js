const passport = require('passport');
const app = require('./app/app');
const PORT = process.env.PORT || 3000;



// ROUTES
// Import all routes over here
app.use('/api', require('./routes/index'));

// Server listens on http://localhost:3000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})