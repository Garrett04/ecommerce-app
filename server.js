const express = require('express');
const app = express();
const PORT = 3000;

const db = require('./db/queries');

app.get('/', (req, res) => {
    res.send('Home page');
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})