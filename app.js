const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const db = require('./src/config/database');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allows for all domains e.g. googleDotCom, bingDotCom, etc
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

app.listen(8080);
