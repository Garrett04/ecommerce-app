const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');

const db = require('./db/db');

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Home page');
})

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})